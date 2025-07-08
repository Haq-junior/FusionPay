import Buffer "mo:base/Buffer";
import HashMap "mo:base/HashMap";
import Int "mo:base/Int";
import Nat "mo:base/Nat";
import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Array "mo:base/Array";
import Iter "mo:base/Iter";
import Debug "mo:base/Debug";

actor FusionPay {
    // Constants for better validation
    private let MAX_CARDS_PER_USER: Nat = 10;
    private let MIN_PAYMENT_AMOUNT: Nat = 1;
    private let MAX_PAYMENT_AMOUNT: Nat = 1_000_000_000;
    private let MAX_DESCRIPTION_LENGTH: Nat = 500;

    // Error types for better error handling
    type ErrorCode = {
        #Unauthorized;
        #InvalidInput;
        #NotFound;
        #InsufficientFunds;
        #LimitExceeded;
        #SystemError;
    };

    type LogLevel = {
        #Info;
        #Warning;
        #Error;
    };

    type LogEntry = {
        timestamp: Int;
        level: LogLevel;
        message: Text;
        principal: ?Principal;
    };

    // Enhanced types
    type PaymentStatus = {
        #Pending;
        #Completed;
        #Failed;
        #Cancelled;
    };

    type PaymentType = {
        #MobileMoney;
        #Card;
        #ICP;
        #BankTransfer;
    };

    type Payment = {
        id: Text;
        amount: Nat;
        currency: Text;
        status: PaymentStatus;
        paymentType: PaymentType;
        timestamp: Int;
        from: Principal;
        to: Principal;
        description: Text;
        fee: Nat;
    };

    type VirtualCard = {
        id: Text;
        owner: Principal;
        balance: Nat;
        currency: Text;
        isActive: Bool;
        created: Int;
        lastUsed: ?Int;
        dailyLimit: Nat;
        monthlyLimit: Nat;
        cardNumber: Text;
    };

    type Result<T, E> = {
        #ok: T;
        #err: E;
    };

    // State variables with stable storage for upgrades
    private stable var nextPaymentId: Nat = 0;
    private stable var nextCardId: Nat = 0;
    private stable var paymentsEntries: [(Text, Payment)] = [];
    private stable var virtualCardsEntries: [(Text, VirtualCard)] = [];
    private stable var userCardsEntries: [(Principal, [Text])] = [];
    private stable var logEntries: [LogEntry] = [];

    private let payments = HashMap.HashMap<Text, Payment>(0, Text.equal, Text.hash);
    private let virtualCards = HashMap.HashMap<Text, VirtualCard>(0, Text.equal, Text.hash);
    private let userCards = HashMap.HashMap<Principal, Buffer.Buffer<Text>>(0, Principal.equal, Principal.hash);
    private let logs = Buffer.Buffer<LogEntry>(100);

    // Logging system
    private func log(level: LogLevel, message: Text, principal: ?Principal) {
        let entry: LogEntry = {
            timestamp = Time.now();
            level = level;
            message = message;
            principal = principal;
        };
        logs.add(entry);
        Debug.print("[" # logLevelToText(level) # "] " # message);
    };

    private func logLevelToText(level: LogLevel): Text {
        switch (level) {
            case (#Info) { "INFO" };
            case (#Warning) { "WARN" };
            case (#Error) { "ERROR" };
        }
    };

    private func logError(message: Text, principal: ?Principal) {
        log(#Error, message, principal);
    };

    private func logInfo(message: Text, principal: ?Principal) {
        log(#Info, message, principal);
    };

    private func logWarning(message: Text, principal: ?Principal) {
        log(#Warning, message, principal);
    };

    // System upgrade hooks for data persistence
    system func preupgrade() {
        paymentsEntries := Iter.toArray(payments.entries());
        virtualCardsEntries := Iter.toArray(virtualCards.entries());
        
        // Convert userCards to stable format
        let userCardsBuffer = Buffer.Buffer<(Principal, [Text])>(userCards.size());
        for ((principal, cardIds) in userCards.entries()) {
            userCardsBuffer.add((principal, Buffer.toArray(cardIds)));
        };
        userCardsEntries := Buffer.toArray(userCardsBuffer);
        
        // Store logs
        logEntries := Buffer.toArray(logs);
    };

    system func postupgrade() {
        // Restore payments
        for ((id, payment) in paymentsEntries.vals()) {
            payments.put(id, payment);
        };
        
        // Restore cards
        for ((id, card) in virtualCardsEntries.vals()) {
            virtualCards.put(id, card);
        };
        
        // Restore user cards
        for ((principal, cardIds) in userCardsEntries.vals()) {
            let buffer = Buffer.Buffer<Text>(cardIds.size());
            for (cardId in cardIds.vals()) {
                buffer.add(cardId);
            };
            userCards.put(principal, buffer);
        };
        
        // Restore logs
        logs.clear();
        for (entry in logEntries.vals()) {
            logs.add(entry);
        };
        
        // Clear stable storage
        paymentsEntries := [];
        virtualCardsEntries := [];
        userCardsEntries := [];
        logEntries := [];
        
        logInfo("System upgraded successfully", null);
    };

    // Helper functions
    private func generateId(prefix: Text, counter: Nat): Text {
        prefix # "-" # Int.toText(Time.now()) # "-" # Nat.toText(counter)
    };

    private func generateCardNumber(): Text {
        let timestamp = Int.abs(Time.now());
        let card_num = timestamp % 10000000000000000;
        "4" # Nat.toText(card_num)
    };

    // Enhanced validation functions
    private func validatePaymentAmount(amount: Nat): Bool {
        amount >= MIN_PAYMENT_AMOUNT and amount <= MAX_PAYMENT_AMOUNT
    };

    private func validateDescription(description: Text): Bool {
        Text.size(description) <= MAX_DESCRIPTION_LENGTH
    };

    private func validateCurrency(currency: Text): Bool {
        currency == "GHS" or currency == "USD" or currency == "EUR" or currency == "ICP"
    };

    private func validatePrincipal(principal: Principal): Bool {
        not Principal.isAnonymous(principal)
    };

    private func canUserCreateCard(principal: Principal): Bool {
        switch (userCards.get(principal)) {
            case null { true };
            case (?cards) { cards.size() < MAX_CARDS_PER_USER };
        }
    };

    // Fee calculation
    private func calculateFee(amount: Nat, paymentType: PaymentType): Nat {
        switch (paymentType) {
            case (#MobileMoney) { amount * 5 / 1000 }; // 0.5%
            case (#Card) { amount * 3 / 1000 }; // 0.3%
            case (#ICP) { 10_000 }; // Fixed fee in e8s
            case (#BankTransfer) { amount * 2 / 1000 }; // 0.2%
        }
    };

    // Enhanced error handling
    private func handleError(error: ErrorCode, message: Text, principal: ?Principal): Text {
        let errorMessage = switch (error) {
            case (#Unauthorized) { "Unauthorized: " # message };
            case (#InvalidInput) { "Invalid input: " # message };
            case (#NotFound) { "Not found: " # message };
            case (#InsufficientFunds) { "Insufficient funds: " # message };
            case (#LimitExceeded) { "Limit exceeded: " # message };
            case (#SystemError) { "System error: " # message };
        };
        logError(errorMessage, principal);
        errorMessage
    };

    // Enhanced Payment Management
    public shared(msg) func createPayment(amount: Nat, currency: Text, paymentType: PaymentType, to: Principal, description: Text): async Result<Payment, Text> {
        let caller = msg.caller;
        
        // Comprehensive validation
        if (not validatePrincipal(caller)) {
            return #err(handleError(#Unauthorized, "Anonymous principal not allowed", ?caller));
        };
        
        if (not validatePaymentAmount(amount)) {
            return #err(handleError(#InvalidInput, "Amount must be between " # Nat.toText(MIN_PAYMENT_AMOUNT) # " and " # Nat.toText(MAX_PAYMENT_AMOUNT), ?caller));
        };
        
        if (not validateCurrency(currency)) {
            return #err(handleError(#InvalidInput, "Unsupported currency: " # currency, ?caller));
        };
        
        if (not validateDescription(description)) {
            return #err(handleError(#InvalidInput, "Description too long (max " # Nat.toText(MAX_DESCRIPTION_LENGTH) # " characters)", ?caller));
        };
        
        if (not validatePrincipal(to)) {
            return #err(handleError(#InvalidInput, "Invalid recipient principal", ?caller));
        };
        
        if (Principal.equal(caller, to)) {
            return #err(handleError(#InvalidInput, "Cannot send payment to yourself", ?caller));
        };

        let paymentId = generateId("payment", nextPaymentId);
        nextPaymentId += 1;

        let payment: Payment = {
            id = paymentId;
            amount = amount;
            currency = currency;
            status = #Pending;
            paymentType = paymentType;
            timestamp = Time.now();
            from = caller;
            to = to;
            description = description;
            fee = calculateFee(amount, paymentType);
        };

        payments.put(paymentId, payment);
        logInfo("Payment created: " # paymentId # " for " # Nat.toText(amount) # " " # currency, ?caller);
        
        #ok(payment)
    };

    public shared(_msg) func getPayment(paymentId: Text): async Result<Payment, Text> {
        switch (payments.get(paymentId)) {
            case (?payment) { #ok(payment) };
            case null { #err("Payment not found") };
        }
    };

    public shared(msg) func getUserPayments(): async [Payment] {
        let caller = msg.caller;
        let userPayments = Buffer.Buffer<Payment>(0);
        
        for ((_, payment) in payments.entries()) {
            if (payment.from == caller or payment.to == caller) {
                userPayments.add(payment);
            };
        };
        
        Buffer.toArray(userPayments)
    };

    // Virtual Card Management
    public shared(msg) func createVirtualCard(currency: Text): async Result<VirtualCard, Text> {
        let caller = msg.caller;
        
        // Check card limit
        switch (userCards.get(caller)) {
            case (?cardBuffer) {
                if (cardBuffer.size() >= MAX_CARDS_PER_USER) {
                    return #err("Maximum number of cards reached");
                };
            };
            case null {};
        };
        
        let card: VirtualCard = {
            id = generateId("CARD", nextCardId);
            owner = caller;
            balance = 0;
            currency = currency;
            isActive = true;
            created = Time.now();
            lastUsed = null;
            dailyLimit = 10000;
            monthlyLimit = 100000;
            cardNumber = generateCardNumber();
        };

        virtualCards.put(card.id, card);
        
        switch (userCards.get(caller)) {
            case (?userCardBuffer) {
                userCardBuffer.add(card.id);
            };
            case null {
                let newBuffer = Buffer.Buffer<Text>(1);
                newBuffer.add(card.id);
                userCards.put(caller, newBuffer);
            };
        };

        nextCardId += 1;
        #ok(card)
    };

    public shared(msg) func getUserCards(): async [VirtualCard] {
        let caller = msg.caller;
        let cards = Buffer.Buffer<VirtualCard>(0);
        
        switch (userCards.get(caller)) {
            case (?userCardBuffer) {
                for (cardId in userCardBuffer.vals()) {
                    switch (virtualCards.get(cardId)) {
                        case (?card) { cards.add(card); };
                        case null {};
                    };
                };
            };
            case null {};
        };
        
        Buffer.toArray(cards)
    };

    public shared(msg) func deactivateCard(cardId: Text): async Result<VirtualCard, Text> {
        let caller = msg.caller;
        
        switch (virtualCards.get(cardId)) {
            case (?card) {
                if (card.owner != caller) {
                    return #err("Not authorized");
                };

                let updatedCard = {
                    id = card.id;
                    owner = card.owner;
                    balance = card.balance;
                    currency = card.currency;
                    isActive = false;
                    created = card.created;
                    lastUsed = card.lastUsed;
                    dailyLimit = card.dailyLimit;
                    monthlyLimit = card.monthlyLimit;
                    cardNumber = card.cardNumber;
                };

                virtualCards.put(cardId, updatedCard);
                #ok(updatedCard)
            };
            case null {
                #err("Card not found")
            };
        }
    };

    // Balance Management
    public shared(msg) func getCardBalance(cardId: Text): async Result<Nat, Text> {
        let caller = msg.caller;
        
        switch (virtualCards.get(cardId)) {
            case (?card) {
                if (card.owner != caller) {
                    return #err("Not authorized");
                };
                #ok(card.balance)
            };
            case null {
                #err("Card not found")
            };
        }
    };

    public shared(msg) func topUpCard(cardId: Text, amount: Nat): async Result<VirtualCard, Text> {
        let caller = msg.caller;
        
        if (amount == 0) {
            return #err("Top-up amount must be greater than 0");
        };
        
        switch (virtualCards.get(cardId)) {
            case (?card) {
                if (card.owner != caller) {
                    return #err("Not authorized");
                };

                if (not card.isActive) {
                    return #err("Card is not active");
                };

                let updatedCard = {
                    id = card.id;
                    owner = card.owner;
                    balance = card.balance + amount;
                    currency = card.currency;
                    isActive = card.isActive;
                    created = card.created;
                    lastUsed = ?Time.now();
                    dailyLimit = card.dailyLimit;
                    monthlyLimit = card.monthlyLimit;
                    cardNumber = card.cardNumber;
                };

                virtualCards.put(cardId, updatedCard);
                #ok(updatedCard)
            };
            case null {
                #err("Card not found")
            };
        }
    };

    // Statistics
    public query func getSystemStats(): async {
        totalPayments: Nat;
        totalCards: Nat;
        totalUsers: Nat;
    } {
        {
            totalPayments = payments.size();
            totalCards = virtualCards.size();
            totalUsers = userCards.size();
        }
    };

    // Administrative Functions
    public query func getLogs(count: ?Nat): async [LogEntry] {
        let maxCount = switch (count) {
            case (?n) { n };
            case null { 100 };
        };
        
        let logArray = Buffer.toArray(logs);
        let totalLogs = logArray.size();
        
        if (totalLogs <= maxCount) {
            logArray
        } else {
            let startIndex = totalLogs - maxCount;
            Array.tabulate(maxCount, func(i: Nat): LogEntry {
                logArray[startIndex + i]
            })
        }
    };

    // Health check
    public query func healthCheck(): async {
        status: Text;
        timestamp: Int;
        version: Text;
    } {
        {
            status = "OK";
            timestamp = Time.now();
            version = "1.0.0";
        }
    };

    // Initialize system
    public func initialize(): async Text {
        logInfo("FusionPay system initialized", null);
        "FusionPay initialized successfully"
    };
};
