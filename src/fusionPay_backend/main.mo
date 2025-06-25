import Buffer "mo:base/Buffer";
import HashMap "mo:base/HashMap";
import Int "mo:base/Int";
import Nat "mo:base/Nat";
import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Time "mo:base/Time";

actor FusionPay {
    // Types
    type PaymentStatus = {
        #Pending;
        #Completed;
        #Failed;
    };

    type PaymentType = {
        #MobileMoney;
        #Card;
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
    };

    type VirtualCard = {
        id: Text;
        owner: Principal;
        balance: Nat;
        currency: Text;
        isActive: Bool;
        created: Int;
        lastUsed: ?Int;
    };

    type Result<T, E> = {
        #ok: T;
        #err: E;
    };

    // State
    private stable var nextPaymentId: Nat = 0;
    private stable var nextCardId: Nat = 0;

    private let payments = HashMap.HashMap<Text, Payment>(0, Text.equal, Text.hash);
    private let virtualCards = HashMap.HashMap<Text, VirtualCard>(0, Text.equal, Text.hash);
    private let userCards = HashMap.HashMap<Principal, Buffer.Buffer<Text>>(0, Principal.equal, Principal.hash);

    // Helper functions
    private func generateId(prefix: Text, counter: Nat): Text {
        prefix # "-" # Int.toText(Time.now()) # "-" # Nat.toText(counter)
    };

    // Payment Management
    public shared(msg) func createPayment(amount: Nat, currency: Text, paymentType: PaymentType, to: Principal, description: Text): async Result<Payment, Text> {
        let caller = msg.caller;
        
        if (amount == 0) {
            return #err("Amount must be greater than 0");
        };

        let payment: Payment = {
            id = generateId("PAY", nextPaymentId);
            amount = amount;
            currency = currency;
            status = #Pending;
            paymentType = paymentType;
            timestamp = Time.now();
            from = caller;
            to = to;
            description = description;
        };

        payments.put(payment.id, payment);
        nextPaymentId += 1;
        #ok(payment)
    };

    public shared(msg) func getPayment(paymentId: Text): async Result<Payment, Text> {
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
        
        let card: VirtualCard = {
            id = generateId("CARD", nextCardId);
            owner = caller;
            balance = 0;
            currency = currency;
            isActive = true;
            created = Time.now();
            lastUsed = null;
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
                };

                virtualCards.put(cardId, updatedCard);
                #ok(updatedCard)
            };
            case null {
                #err("Card not found")
            };
        }
    };
};
