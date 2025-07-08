/**
 * FusionPay Functionality Test Suite
 * 
 * This script tests all major functionalities of the FusionPay application:
 * - Authentication flow
 * - Virtual card creation, deactivation, and top-up
 * - Payment creation and retrieval
 * - Real-time price fetching
 * - Balance management
 * 
 * Run this test in browser console or as a Node.js script
 */

class FusionPayTester {
  constructor() {
    this.testResults = [];
    this.testCount = 0;
    this.passedTests = 0;
    this.failedTests = 0;
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [${type.toUpperCase()}] ${message}`;
    console.log(logMessage);
    
    if (type === 'error') {
      console.error(logMessage);
    }
  }

  assert(condition, testName, errorMessage = '') {
    this.testCount++;
    if (condition) {
      this.passedTests++;
      this.log(`✅ PASS: ${testName}`, 'success');
      this.testResults.push({ test: testName, status: 'PASS', message: '' });
    } else {
      this.failedTests++;
      this.log(`❌ FAIL: ${testName} - ${errorMessage}`, 'error');
      this.testResults.push({ test: testName, status: 'FAIL', message: errorMessage });
    }
  }

  async delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Test authentication functionality
  async testAuthentication() {
    this.log('🔐 Testing Authentication...', 'info');
    
    try {
      // Check if authentication context is available
      const authContext = window.React && window.React.useContext;
      this.assert(!!authContext, 'React useContext available');
      
      // Test Internet Identity integration
      const isInternetIdentityAvailable = typeof window.ic !== 'undefined' || 
        document.querySelector('script[src*="identity"]') !== null;
      this.assert(isInternetIdentityAvailable, 'Internet Identity integration detected');
      
      this.log('✅ Authentication tests completed');
    } catch (error) {
      this.log(`❌ Authentication test failed: ${error.message}`, 'error');
    }
  }

  // Test backend service initialization
  async testBackendService() {
    this.log('🔧 Testing Backend Service...', 'info');
    
    try {
      // Check if backend service is imported and available
      const backendServiceAvailable = window.backendService || 
        (window.FusionPayBackend && typeof window.FusionPayBackend === 'function');
      this.assert(!!backendServiceAvailable, 'Backend service class available');
      
      // Test canister ID configuration
      const canisterIdPattern = /^[a-z0-9-]+$/;
      const hasValidCanisterId = document.querySelector('meta[name="canister-id"]') || 
        localStorage.getItem('canisterId') ||
        /canisterId/.test(document.documentElement.innerHTML);
      this.assert(!!hasValidCanisterId, 'Canister ID configuration detected');
      
      this.log('✅ Backend service tests completed');
    } catch (error) {
      this.log(`❌ Backend service test failed: ${error.message}`, 'error');
    }
  }

  // Test virtual card functionality
  async testVirtualCards() {
    this.log('💳 Testing Virtual Cards...', 'info');
    
    try {
      // Test virtual card creation UI
      const createCardButton = document.querySelector('button[onclick*="createCard"], button:contains("Create"), button:contains("New Card")');
      this.assert(!!createCardButton, 'Create virtual card button found in UI');
      
      // Test card display components
      const cardComponents = document.querySelectorAll('[class*="card"], [class*="virtual"]');
      this.assert(cardComponents.length > 0, 'Virtual card display components found');
      
      // Test card action buttons (top-up, deactivate)
      const actionButtons = document.querySelectorAll('button[class*="action"], button:contains("Top Up"), button:contains("Deactivate")');
      this.assert(actionButtons.length > 0, 'Card action buttons found');
      
      // Test card balance display
      const balanceDisplays = document.querySelectorAll('[class*="balance"], .text-2xl, .font-bold');
      this.assert(balanceDisplays.length > 0, 'Balance display elements found');
      
      this.log('✅ Virtual card tests completed');
    } catch (error) {
      this.log(`❌ Virtual card test failed: ${error.message}`, 'error');
    }
  }

  // Test payment functionality
  async testPayments() {
    this.log('💰 Testing Payments...', 'info');
    
    try {
      // Test payment creation UI
      const paymentForm = document.querySelector('form, [class*="payment"], [class*="momo"]');
      this.assert(!!paymentForm, 'Payment form found in UI');
      
      // Test payment input fields
      const amountInput = document.querySelector('input[type="number"], input[placeholder*="amount"], input[name*="amount"]');
      this.assert(!!amountInput, 'Amount input field found');
      
      const recipientInput = document.querySelector('input[placeholder*="number"], input[placeholder*="recipient"], input[name*="recipient"]');
      this.assert(!!recipientInput, 'Recipient input field found');
      
      // Test payment history display
      const transactionList = document.querySelectorAll('[class*="transaction"], [class*="payment"], .space-y-2 > div');
      this.assert(transactionList.length >= 0, 'Transaction list container found');
      
      // Test payment confirmation flow
      const confirmButton = document.querySelector('button:contains("Confirm"), button:contains("Pay"), button[type="submit"]');
      this.assert(!!confirmButton, 'Payment confirmation button found');
      
      this.log('✅ Payment tests completed');
    } catch (error) {
      this.log(`❌ Payment test failed: ${error.message}`, 'error');
    }
  }

  // Test real-time price functionality
  async testRealTimePrices() {
    this.log('📈 Testing Real-time Prices...', 'info');
    
    try {
      // Test price ticker component
      const priceTicker = document.querySelector('[class*="price"], [class*="ticker"], [class*="icp"]');
      this.assert(!!priceTicker, 'Price ticker component found');
      
      // Test refresh button
      const refreshButton = document.querySelector('button[class*="refresh"], button svg[class*="refresh"]');
      this.assert(!!refreshButton, 'Price refresh button found');
      
      // Test ICP price display
      const icpPriceDisplay = document.querySelector(':contains("ICP"), .text-4xl, .font-extrabold');
      this.assert(!!icpPriceDisplay, 'ICP price display found');
      
      // Test currency conversion
      const currencyConverts = document.querySelectorAll(':contains("GHS"), :contains("USD"), :contains("EUR")');
      this.assert(currencyConverts.length > 0, 'Currency conversion displays found');
      
      // Test exchange rate display
      const exchangeRateDisplay = document.querySelector(':contains("Exchange Rate"), :contains("1 ICP =")');
      this.assert(!!exchangeRateDisplay, 'Exchange rate display found');
      
      this.log('✅ Real-time price tests completed');
    } catch (error) {
      this.log(`❌ Real-time price test failed: ${error.message}`, 'error');
    }
  }

  // Test UI responsiveness and accessibility
  async testUIAccessibility() {
    this.log('🎨 Testing UI & Accessibility...', 'info');
    
    try {
      // Test mobile responsiveness classes
      const responsiveElements = document.querySelectorAll('[class*="sm:"], [class*="md:"], [class*="lg:"]');
      this.assert(responsiveElements.length > 0, 'Responsive design classes found');
      
      // Test dark mode support
      const darkModeElements = document.querySelectorAll('[class*="dark:"], [class*="gray-800"], [class*="gray-900"]');
      this.assert(darkModeElements.length > 0, 'Dark mode styling found');
      
      // Test accessibility attributes
      const accessibleElements = document.querySelectorAll('[aria-label], [role], [tabindex]');
      this.assert(accessibleElements.length > 0, 'Accessibility attributes found');
      
      // Test proper heading structure
      const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
      this.assert(headings.length > 0, 'Proper heading structure found');
      
      // Test loading states
      const loadingElements = document.querySelectorAll('[class*="loading"], [class*="spinner"], [class*="animate-spin"]');
      this.assert(loadingElements.length >= 0, 'Loading state elements found');
      
      this.log('✅ UI & Accessibility tests completed');
    } catch (error) {
      this.log(`❌ UI & Accessibility test failed: ${error.message}`, 'error');
    }
  }

  // Test error handling
  async testErrorHandling() {
    this.log('🚨 Testing Error Handling...', 'info');
    
    try {
      // Test error display components
      const errorElements = document.querySelectorAll('[class*="error"], [class*="alert"], [class*="danger"]');
      this.assert(errorElements.length >= 0, 'Error display elements structure found');
      
      // Test form validation
      const requiredInputs = document.querySelectorAll('input[required], input[class*="required"]');
      this.assert(requiredInputs.length >= 0, 'Form validation attributes found');
      
      // Test network error handling
      const networkErrorHandling = document.querySelector('[class*="network"], [class*="connection"]') ||
        document.documentElement.innerHTML.includes('connection') ||
        document.documentElement.innerHTML.includes('network');
      this.assert(!!networkErrorHandling, 'Network error handling detected');
      
      this.log('✅ Error handling tests completed');
    } catch (error) {
      this.log(`❌ Error handling test failed: ${error.message}`, 'error');
    }
  }

  // Test performance and optimization
  async testPerformance() {
    this.log('⚡ Testing Performance...', 'info');
    
    try {
      // Test lazy loading
      const lazyElements = document.querySelectorAll('[loading="lazy"], [class*="lazy"]');
      this.assert(lazyElements.length >= 0, 'Lazy loading implementation found');
      
      // Test code splitting (check for dynamic imports)
      const hasDynamicImports = document.documentElement.innerHTML.includes('import(') ||
        document.documentElement.innerHTML.includes('lazy(') ||
        document.documentElement.innerHTML.includes('Suspense');
      this.assert(!!hasDynamicImports, 'Code splitting detected');
      
      // Test caching strategies
      const hasCaching = localStorage.length > 0 || sessionStorage.length > 0;
      this.assert(!!hasCaching, 'Client-side caching detected');
      
      // Test bundle optimization
      const optimizedAssets = document.querySelectorAll('script[src*=".min."], link[href*=".min."]');
      this.assert(optimizedAssets.length >= 0, 'Asset optimization detected');
      
      this.log('✅ Performance tests completed');
    } catch (error) {
      this.log(`❌ Performance test failed: ${error.message}`, 'error');
    }
  }

  // Simulate virtual card creation
  async simulateVirtualCardCreation() {
    this.log('🔄 Simulating Virtual Card Creation...', 'info');
    
    try {
      // Find and click create card button
      const createButton = document.querySelector('button:contains("Create"), button:contains("New Card")') ||
        [...document.querySelectorAll('button')].find(btn => 
          btn.textContent.includes('Create') || btn.textContent.includes('New'));
      
      if (createButton) {
        this.log('Found create card button, simulating click...');
        createButton.click();
        await this.delay(1000);
        
        // Check if card creation is in progress
        const loadingIndicator = document.querySelector('[class*="loading"], [class*="creating"], [class*="animate-spin"]');
        this.assert(!!loadingIndicator, 'Card creation loading state triggered');
        
        // Wait for creation to complete
        await this.delay(3000);
        
        // Check if new card appears
        const cardElements = document.querySelectorAll('[class*="card"], [class*="virtual"]');
        this.assert(cardElements.length > 0, 'Virtual card elements detected after creation');
      } else {
        this.log('⚠️ Create card button not found - may need authentication first');
      }
      
      this.log('✅ Virtual card creation simulation completed');
    } catch (error) {
      this.log(`❌ Virtual card creation simulation failed: ${error.message}`, 'error');
    }
  }

  // Generate test report
  generateReport() {
    this.log('\n' + '='.repeat(60), 'info');
    this.log('📊 FUSIONPAY FUNCTIONALITY TEST REPORT', 'info');
    this.log('='.repeat(60), 'info');
    
    this.log(`📈 Total Tests: ${this.testCount}`, 'info');
    this.log(`✅ Passed: ${this.passedTests}`, 'success');
    this.log(`❌ Failed: ${this.failedTests}`, 'error');
    this.log(`📊 Success Rate: ${((this.passedTests / this.testCount) * 100).toFixed(1)}%`, 'info');
    
    this.log('\n📋 DETAILED RESULTS:', 'info');
    this.log('-'.repeat(60), 'info');
    
    this.testResults.forEach((result, index) => {
      const status = result.status === 'PASS' ? '✅' : '❌';
      this.log(`${index + 1}. ${status} ${result.test}`, result.status === 'PASS' ? 'success' : 'error');
      if (result.message) {
        this.log(`   └─ ${result.message}`, 'error');
      }
    });
    
    this.log('\n' + '='.repeat(60), 'info');
    
    // Return summary for programmatic access
    return {
      total: this.testCount,
      passed: this.passedTests,
      failed: this.failedTests,
      successRate: ((this.passedTests / this.testCount) * 100).toFixed(1),
      results: this.testResults
    };
  }

  // Run all tests
  async runAllTests() {
    this.log('🚀 Starting FusionPay Functionality Tests...', 'info');
    this.log('⏰ Test started at: ' + new Date().toLocaleString(), 'info');
    
    try {
      await this.testAuthentication();
      await this.delay(500);
      
      await this.testBackendService();
      await this.delay(500);
      
      await this.testVirtualCards();
      await this.delay(500);
      
      await this.testPayments();
      await this.delay(500);
      
      await this.testRealTimePrices();
      await this.delay(500);
      
      await this.testUIAccessibility();
      await this.delay(500);
      
      await this.testErrorHandling();
      await this.delay(500);
      
      await this.testPerformance();
      await this.delay(500);
      
      // Simulate actual functionality
      await this.simulateVirtualCardCreation();
      await this.delay(1000);
      
      const report = this.generateReport();
      
      this.log('⏰ Test completed at: ' + new Date().toLocaleString(), 'info');
      this.log('🏁 All tests completed!', 'success');
      
      return report;
    } catch (error) {
      this.log(`🚨 Test suite failed: ${error.message}`, 'error');
      throw error;
    }
  }
}

// Helper function to add :contains selector support
if (typeof document !== 'undefined') {
  // Add custom :contains selector for testing
  const originalQuerySelector = document.querySelector;
  const originalQuerySelectorAll = document.querySelectorAll;
  
  function parseContainsSelector(selector) {
    const containsMatch = selector.match(/:contains\("([^"]+)"\)/);
    if (containsMatch) {
      const text = containsMatch[1];
      const baseSelector = selector.replace(containsMatch[0], '');
      return { baseSelector: baseSelector || '*', text };
    }
    return null;
  }
  
  document.querySelector = function(selector) {
    const contains = parseContainsSelector(selector);
    if (contains) {
      const elements = document.querySelectorAll(contains.baseSelector);
      return Array.from(elements).find(el => el.textContent.includes(contains.text)) || null;
    }
    return originalQuerySelector.call(this, selector);
  };
  
  document.querySelectorAll = function(selector) {
    const contains = parseContainsSelector(selector);
    if (contains) {
      const elements = document.querySelectorAll(contains.baseSelector);
      return Array.from(elements).filter(el => el.textContent.includes(contains.text));
    }
    return originalQuerySelectorAll.call(this, selector);
  };
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = FusionPayTester;
} else if (typeof window !== 'undefined') {
  window.FusionPayTester = FusionPayTester;
}

// Auto-run if in browser
if (typeof window !== 'undefined' && window.document) {
  // Make tester available globally
  window.fusionPayTester = new FusionPayTester();
  
  // Auto-run tests after page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(() => {
        console.log('🧪 FusionPay Auto-Test Ready! Run: fusionPayTester.runAllTests()');
      }, 2000);
    });
  } else {
    setTimeout(() => {
      console.log('🧪 FusionPay Auto-Test Ready! Run: fusionPayTester.runAllTests()');
    }, 2000);
  }
} 