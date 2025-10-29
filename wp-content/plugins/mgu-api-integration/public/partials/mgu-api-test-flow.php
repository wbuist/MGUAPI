<?php
/**
 * Provide a public-facing view for the plugin
 *
 * This file is used to markup the public-facing aspects of the plugin.
 *
 * @link       https://github.com/wbuist
 * @since      1.0.0
 *
 * @package    MGU_API_Integration
 * @subpackage MGU_API_Integration/public/partials
 */

// If this file is called directly, abort.
if (!defined('WPINC')) {
    die;
}

// Get the API client
$api_client = new MGU_API_Client();
?>

<div class="mgu-api-test-flow">
    <h2>MGU API V2 Insurance Policy Flow Test</h2>
    <p class="mgu-api-description">Test the enhanced V2 API features including multiple gadgets, loss cover options, and improved customer management.</p>

    <div class="mgu-api-steps">
        <!-- Step 1: Gadget Type Selection -->
        <div id="step-gadget-type" class="mgu-api-step">
            <h3>Select Gadget Type</h3>
            <div class="mgu-api-form-group">
                <select id="gadget-type-select" class="mgu-api-select">
                    <option value="">Select a gadget type...</option>
                    <option value="MobilePhone">Mobile Phone</option>
                    <option value="Laptop">Laptop</option>
                    <option value="Tablet">Tablet</option>
                    <option value="VRHeadset">VR Headset</option>
                    <option value="Watch">Watch</option>
                    <option value="GamesConsole">Games Console</option>
                </select>
            </div>
            <div class="mgu-api-step-result"></div>
        </div>

        <!-- Step 2: Manufacturer Selection -->
        <div class="mgu-api-step" id="step-manufacturer" style="display: none;">
            <h3>Select Manufacturer</h3>
            <select id="manufacturer-select" class="mgu-api-select">
                <option value="">Select a manufacturer...</option>
            </select>
            <div class="mgu-api-step-result"></div>
        </div>

        <!-- Step 3: Model Selection -->
        <div class="mgu-api-step" id="step-model" style="display: none;">
            <h3>Select Model</h3>
            <select id="model-select" class="mgu-api-select">
                <option value="">Select a model...</option>
            </select>
            <div class="mgu-api-step-result"></div>
        </div>

        <!-- Step 4: Device Details -->
        <div id="step-device" class="mgu-api-step" style="display: none;">
            <h3>Device Details</h3>
            <form id="device-form" class="mgu-api-form">
                <div class="mgu-api-form-group">
                    <label for="device-purchase-date">Purchase Date (Required)</label>
                    <input type="date" id="device-purchase-date" class="mgu-api-input" required>
                    <small class="mgu-api-help-text">Must be within the last 36 months</small>
                </div>
                <div class="mgu-api-form-group">
                    <label for="device-purchase-price">Purchase Price (Optional)</label>
                    <input type="number" id="device-purchase-price" class="mgu-api-input" min="0" step="0.01">
                </div>
                <div class="mgu-api-form-group">
                    <label for="device-serial-number">Serial Number (Optional)</label>
                    <input type="text" id="device-serial-number" class="mgu-api-input">
                </div>
                <!-- Memory Options (Dynamic Radio Buttons) -->
                <div id="memory-options-container" class="mgu-api-form-group" style="display: none;">
                    <label>Memory Option (Required)</label>
                    <div id="memory-radio-buttons">
                        <!-- Populated dynamically based on selected model -->
                    </div>
                </div>
                <!-- Premium Period Selection -->
                <div id="premium-period-container" class="mgu-api-form-group" style="display: none;">
                    <label>Premium Period (Required)</label>
                    <div id="premium-period-buttons" class="mgu-api-radio-group">
                        <!-- Populated dynamically with premium amounts -->
                    </div>
                </div>
                <button type="submit" id="get-quote-btn" class="mgu-api-button" disabled>Add to Quote</button>
            </form>
            <div class="mgu-api-step-result"></div>
        </div>

        <!-- Step 5: Quote Summary -->
        <div id="step-quote" class="mgu-api-step" style="display: none;">
            <h3>Review Your Quote</h3>
            
            <!-- Gadget List -->
            <div id="gadget-list" class="mgu-api-gadget-list">
                <!-- Populated dynamically -->
            </div>
            
            <!-- Loss Cover Option (Policy Level) -->
            <div class="mgu-api-form-group">
                <label>
                    <input type="checkbox" id="policy-loss-cover" name="policy-loss-cover" value="yes">
                    Add Loss Cover Protection (applies to all gadgets)
                </label>
                <div id="policy-loss-cover-info" style="margin-top: 10px;">
                    <!-- Loss cover pricing -->
                </div>
            </div>
            
            <!-- Total Premium Display -->
            <div id="total-premium-display" class="mgu-api-total-premium">
                <!-- Total premium -->
            </div>
            
            <!-- Action Buttons -->
            <button type="button" id="add-another-gadget" class="mgu-api-button mgu-api-button-secondary">Add Another Gadget</button>
            <button type="button" id="proceed-to-policy" class="mgu-api-button">Buy Policy</button>
            
            <div class="mgu-api-step-result"></div>
        </div>

        <!-- Step 5.5: Add Another Gadget -->
        <div id="step-add-gadget" class="mgu-api-step" style="display: none;">
            <h3>Add Another Gadget to Policy</h3>
            <form id="add-gadget-form" class="mgu-api-form">
                <div class="mgu-api-form-group">
                    <label for="add-gadget-type">Gadget Type</label>
                    <select id="add-gadget-type" class="mgu-api-select" required>
                        <option value="">Select a gadget type...</option>
                        <option value="MobilePhone">Mobile Phone</option>
                        <option value="Laptop">Laptop</option>
                        <option value="Tablet">Tablet</option>
                        <option value="VRHeadset">VR Headset</option>
                        <option value="Watch">Watch</option>
                        <option value="GamesConsole">Games Console</option>
                    </select>
                </div>
                <div class="mgu-api-form-group">
                    <label for="add-manufacturer">Manufacturer</label>
                    <select id="add-manufacturer" class="mgu-api-select" required>
                        <option value="">Select a manufacturer...</option>
                    </select>
                </div>
                <div class="mgu-api-form-group">
                    <label for="add-model">Model</label>
                    <select id="add-model" class="mgu-api-select" required>
                        <option value="">Select a model...</option>
                    </select>
                </div>
                <div class="mgu-api-form-group">
                    <label for="add-purchase-price">Purchase Price</label>
                    <input type="number" id="add-purchase-price" class="mgu-api-input" min="0" step="0.01" required>
                </div>
                <div class="mgu-api-form-group">
                    <label for="add-memory">Installed Memory (Optional)</label>
                    <input type="text" id="add-memory" class="mgu-api-input" placeholder="e.g., 128GB, 256GB">
                </div>
                <div class="mgu-api-form-group">
                    <label for="add-serial">Serial Number (Optional)</label>
                    <input type="text" id="add-serial" class="mgu-api-input">
                </div>
                <button type="submit" class="mgu-api-button">Add Gadget</button>
                <button type="button" id="cancel-add-gadget" class="mgu-api-button mgu-api-button-secondary">Cancel</button>
            </form>
            <div class="mgu-api-step-result"></div>
        </div>

        <!-- Step 6: Policy Creation -->
        <div class="mgu-api-step" id="step-policy" style="display: none;">
            <h3>Create Policy</h3>
            <form id="policy-form" class="mgu-api-form">
                <div class="form-group">
                    <label for="policy-first-name">First Name</label>
                    <input type="text" id="policy-first-name" required>
                </div>
                <div class="form-group">
                    <label for="policy-last-name">Last Name</label>
                    <input type="text" id="policy-last-name" required>
                </div>
                <div class="form-group">
                    <label for="policy-email">Email</label>
                    <input type="email" id="policy-email" required>
                </div>
                <div class="form-group">
                    <label for="policy-phone">Phone</label>
                    <input type="tel" id="policy-phone" required>
                </div>
                <div class="form-group">
                    <label for="policy-company">Company Name (Optional)</label>
                    <input type="text" id="policy-company">
                </div>
                <div class="form-group">
                    <label for="policy-external-id">External Customer ID (Optional)</label>
                    <input type="text" id="policy-external-id" placeholder="For integration with external systems">
                    <small class="mgu-api-help-text">Leave blank if not needed</small>
                </div>
                <div class="form-group">
                    <label for="policy-address1">Address Line 1</label>
                    <input type="text" id="policy-address1" required>
                </div>
                <div class="form-group">
                    <label for="policy-address2">Address Line 2 (Optional)</label>
                    <input type="text" id="policy-address2">
                </div>
                <div class="form-group">
                    <label for="policy-address3">Address Line 3 (Optional)</label>
                    <input type="text" id="policy-address3">
                </div>
                <div class="form-group">
                    <label for="policy-address4">Address Line 4 (Optional)</label>
                    <input type="text" id="policy-address4">
                </div>
                <div class="form-group">
                    <label for="policy-postcode">Postcode</label>
                    <input type="text" id="policy-postcode" required>
                </div>
                <div class="form-group">
                    <label for="policy-home-phone">Home Phone (Optional)</label>
                    <input type="tel" id="policy-home-phone">
                </div>
                <div class="form-group">
                    <label>
                        <input type="checkbox" id="policy-marketing"> I agree to receive marketing communications
                    </label>
                </div>
                
                <h4>Payment Details</h4>
                <div class="form-group">
                    <label for="policy-account-name">Account Holder Name</label>
                    <input type="text" id="policy-account-name" required>
                </div>
                <div class="form-group">
                    <label for="policy-account-number">Account Number</label>
                    <input type="text" id="policy-account-number" required pattern="[0-9]{8,12}" maxlength="12">
                </div>
                <div class="form-group">
                    <label for="policy-sort-code">Sort Code</label>
                    <input type="text" id="policy-sort-code" required pattern="[0-9]{6}" maxlength="6" placeholder="123456">
                </div>
                
                <button type="submit" class="mgu-api-button">Create Policy & Setup Payment</button>
            </form>
            <div class="mgu-api-step-result"></div>
        </div>
    </div>
</div>

<style>
.mgu-api-test-flow {
    max-width: 800px;
    margin: 2em auto;
    padding: 20px;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    font-size: 16px;
}

.mgu-api-step {
    margin-bottom: 2em;
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 4px;
}

.mgu-api-step h3 {
    margin-top: 0;
    color: #333;
    font-size: 1.4em;
    margin-bottom: 1em;
}

.mgu-api-select {
    width: 100%;
    padding: 12px;
    margin-bottom: 1em;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 16px;
    line-height: 1.4;
    background-color: #fff;
    cursor: pointer;
}

.mgu-api-select option {
    padding: 12px;
    font-size: 16px;
    line-height: 1.4;
}

.mgu-api-form .form-group {
    margin-bottom: 1.5em;
}

.mgu-api-form label {
    display: block;
    margin-bottom: 0.5em;
    color: #333;
    font-size: 1.1em;
}

.mgu-api-form input {
    width: 100%;
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 16px;
}

.mgu-api-button {
    background: #0073aa;
    color: #fff;
    padding: 12px 24px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
    font-weight: 500;
}

.mgu-api-button:hover {
    background: #005177;
}

.mgu-api-step-result {
    margin-top: 1em;
    padding: 15px;
    border-radius: 4px;
    font-size: 16px;
}

.mgu-api-step-result.success {
    background: #dff0d8;
    color: #3c763d;
}

.mgu-api-step-result.error {
    background: #f2dede;
    color: #a94442;
}

.mgu-api-quote-details {
    margin: 1em 0;
    padding: 20px;
    background: #f9f9f9;
    border-radius: 4px;
    font-size: 16px;
}

.mgu-api-quote-actions {
    margin: 1em 0;
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
}

.mgu-api-button-secondary {
    background: #6c757d;
}

.mgu-api-button-secondary:hover {
    background: #545b62;
}

.mgu-api-description {
    margin-bottom: 2em;
    padding: 15px;
    background: #e7f3ff;
    border-left: 4px solid #0073aa;
    border-radius: 4px;
    color: #333;
}

.mgu-api-form-group {
    margin-bottom: 1.5em;
}

.mgu-api-form-group label {
    display: block;
    margin-bottom: 0.5em;
    color: #333;
    font-weight: 500;
}

.mgu-api-form-group input[type="checkbox"] {
    width: auto;
    margin-right: 8px;
}

.mgu-api-current-basket {
    margin: 1em 0;
    padding: 15px;
    background: #f8f9fa;
    border-radius: 4px;
    border: 1px solid #dee2e6;
}

.mgu-api-basket-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 0;
    border-bottom: 1px solid #dee2e6;
}

.mgu-api-basket-item:last-child {
    border-bottom: none;
}

.mgu-api-remove-item {
    background: #dc3545;
    color: white;
    border: none;
    padding: 5px 10px;
    border-radius: 3px;
    cursor: pointer;
    font-size: 12px;
}

.mgu-api-remove-item:hover {
    background: #c82333;
}

.mgu-api-help-text {
    display: block;
    color: #666;
    font-size: 0.9em;
    margin-top: 5px;
}

.mgu-api-radio-group {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-top: 10px;
}

.mgu-api-radio-option {
    display: flex;
    align-items: center;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s;
}

.mgu-api-radio-option:hover {
    background-color: #f5f5f5;
}

.mgu-api-radio-option input[type="radio"] {
    margin-right: 10px;
}

.mgu-api-radio-option.selected {
    background-color: #e3f2fd;
    border-color: #2196f3;
}

.mgu-api-button:disabled,
.mgu-api-button.disabled {
    background-color: #ccc !important;
    color: #666 !important;
    cursor: not-allowed !important;
    opacity: 0.6;
}

.mgu-api-button.enabled {
    background-color: #007cba !important;
    color: white !important;
    cursor: pointer !important;
    opacity: 1;
}

.mgu-api-button.enabled:hover {
    background-color: #005a87 !important;
}
</style>

<script>
jQuery(document).ready(function($) {
    // Global variables for V2 features
    let currentBasketId = null;
    let currentCustomerId = null;
    let basketItems = [];
    let lossCoverEnabled = false;
    let selectedModelData = null;

    // Gadget type change handler
    $('#gadget-type-select').on('change', function() {
        const gadgetType = $(this).val();
        if (gadgetType) {
            loadManufacturersByGadgetType(gadgetType);
            $('#step-manufacturer').show();
        } else {
            $('#step-manufacturer').hide();
            $('#step-model').hide();
            $('#step-device').hide();
            $('#step-quote').hide();
            $('#step-policy').hide();
        }
    });

    // Manufacturer change handler
    $('#manufacturer-select').on('change', function() {
        const manufacturerId = $(this).val();
        const gadgetType = $('#gadget-type-select').val();
        if (manufacturerId && gadgetType) {
            loadModels(manufacturerId, gadgetType);
            $('#step-model').show();
        } else {
            $('#step-model').hide();
            $('#step-device').hide();
            $('#step-quote').hide();
            $('#step-policy').hide();
        }
    });

    // Model change handler
    $('#model-select').on('change', function() {
        const modelId = $(this).val();
        const selectedOption = $(this).find('option:selected');
        
        if (modelId) {
            // Store the full model data (we'll need to get this from the models array)
            // For now, we'll store the model ID and get the full data when needed
            selectedModelData = {
                id: modelId,
                name: selectedOption.text()
            };
            
            // Show Step 4
            $('#step-device').show();
            
            // Reset form first (this sets today's date and clears containers)
            resetDeviceForm();
            
            // Populate memory options if available (after form reset)
            console.log('DEBUG - Model selected, populating memory options for model:', selectedModelData);
            populateMemoryOptions();
            
            // Trigger initial validation
            setTimeout(function() {
                validateQuoteButton();
            }, 100);
        } else {
            selectedModelData = null;
            $('#step-device').hide();
            $('#step-quote').hide();
            $('#step-policy').hide();
        }
    });

    // Add event handlers for form validation
    $('#device-purchase-date, #device-purchase-price').on('input change', function() {
        validateQuoteButton();
    });
    
    // Add event handler for premium period selection
    $(document).on('change', 'input[name="premium-period"]', function() {
        validateQuoteButton();
    });
    
    
    // Add click handler for quote button debugging
    $('#get-quote-btn').on('click', function(e) {
        console.log('Quote button clicked!');
        console.log('Button disabled state:', $(this).prop('disabled'));
        console.log('Button classes:', $(this).attr('class'));
        
        if ($(this).prop('disabled')) {
            console.log('Button is disabled - preventing form submission');
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
    });
    
    // Device form submit handler
    $('#device-form').on('submit', function(e) {
        e.preventDefault();
        
        if ($('#get-quote-btn').prop('disabled')) {
            return; // Don't submit if button is disabled
        }
        
        const deviceData = {
            productId: selectedModelData.id,
            memoryInstalled: $('input[name="memory-option"]:checked').val(),
            purchasePrice: parseFloat($('#device-purchase-price').val()) || 0,
            purchaseDate: $('#device-purchase-date').val(),
            serialNumber: $('#device-serial-number').val(),
            premiumPeriod: $('input[name="premium-period"]:checked').val()
        };
        // Since we already have the quote data from the premium period selection,
        // we can go directly to policy creation
        console.log('DEBUG - Device form submitted, going directly to policy creation');
        $('#step-policy').show();
    });


    // Add another gadget handler
    $('#add-another-gadget').on('click', function() {
        $('#step-add-gadget').show();
        // Load manufacturers for the add gadget form
        loadManufacturersForAddGadget();
    });

    // Cancel add gadget handler
    $('#cancel-add-gadget').on('click', function() {
        $('#step-add-gadget').hide();
    });

    // Add gadget form submit handler
    $('#add-gadget-form').on('submit', function(e) {
        e.preventDefault();
        const gadgetData = {
            gadgetType: $('#add-gadget-type').val(),
            manufacturerId: $('#add-manufacturer').val(),
            modelId: $('#add-model').val(),
            purchasePrice: parseFloat($('#add-purchase-price').val()) || 0,
            memory: $('#add-memory').val(),
            serialNumber: $('#add-serial').val()
        };
        addGadgetToBasket(gadgetData);
    });

    // Toggle loss cover handler
    $('#toggle-loss-cover').on('click', function() {
        toggleLossCover();
    });

    // Policy form submit handler
    $('#policy-form').on('submit', function(e) {
        e.preventDefault();
        const policyData = {
            firstName: $('#policy-first-name').val(),
            lastName: $('#policy-last-name').val(),
            email: $('#policy-email').val(),
            phone: $('#policy-phone').val(),
            company: $('#policy-company').val(),
            address1: $('#policy-address1').val(),
            address2: $('#policy-address2').val(),
            address3: $('#policy-address3').val(),
            address4: $('#policy-address4').val(),
            postcode: $('#policy-postcode').val(),
            homePhone: $('#policy-home-phone').val(),
            marketing: $('#policy-marketing').is(':checked'),
            marketingConsent: $('#policy-marketing').is(':checked') ? 'Yes' : 'No',
            // Bank account details for payment
            accountName: $('#policy-account-name').val(),
            accountNumber: $('#policy-account-number').val(),
            sortCode: $('#policy-sort-code').val()
        };
        createPolicy(policyData);
    });


    // Function to populate memory options based on selected model
    function populateMemoryOptions() {
        // We need to get the full model data from the models that were loaded
        // For now, we'll make an AJAX call to get the model details
        if (!selectedModelData) {
            console.log('DEBUG - No selectedModelData available');
            return;
        }
        
        console.log('DEBUG - populateMemoryOptions called with selectedModelData:', selectedModelData);
        
        $.ajax({
            url: mgu_api.ajax_url,
            type: 'POST',
            data: {
                action: 'mgu_api_get_models',
                manufacturer_id: $('#manufacturer-select').val(),
                gadget_type: $('#gadget-type-select').val(),
                nonce: mgu_api.nonce
            },
            success: function(response) {
                if (response.success && response.data && response.data.value) {
                    const models = response.data.value;
                    const selectedModel = models.find(model => model.id == selectedModelData.id);
                    
                    if (selectedModel && selectedModel.memoryOptions && selectedModel.memoryOptions.length > 0) {
                        // Show memory options container
                        $('#memory-options-container').show();
                        
                        // Clear existing options
                        $('#memory-radio-buttons').empty();
                        
                        // Add radio buttons for each memory option
                        selectedModel.memoryOptions.forEach(function(memoryOption) {
                            const radioId = 'memory-' + memoryOption.replace(/[^a-zA-Z0-9]/g, '');
                            const radioHtml = `
                                <div class="mgu-api-radio-option">
                                    <input type="radio" id="${radioId}" name="memory-option" value="${memoryOption}">
                                    <label for="${radioId}">${memoryOption}</label>
                                </div>
                            `;
                            $('#memory-radio-buttons').append(radioHtml);
                        });
                        
                        // Add click handler for radio options
                        $('.mgu-api-radio-option').on('click', function() {
                            $(this).addClass('selected').siblings().removeClass('selected');
                            $(this).find('input[type="radio"]').prop('checked', true);
                            
                            // Get quote data to populate premium period options
                            populatePremiumPeriodOptions(selectedModel.id, $(this).find('input[type="radio"]').val());
                            
                            validateQuoteButton();
                        });
                    } else {
                        // Hide memory options if none available
                        $('#memory-options-container').hide();
                    }
                }
            }
        });
    }
    
    // Function to populate premium period options with quote data
    function populatePremiumPeriodOptions(productId, memoryInstalled) {
        // Get current form data
        const purchasePrice = parseFloat($('#device-purchase-price').val()) || 0;
        
        console.log('DEBUG - Populating premium period options for product:', productId, 'memory:', memoryInstalled, 'price:', purchasePrice);
        
        $.ajax({
            url: mgu_api.ajax_url,
            type: 'POST',
            data: {
                action: 'mgu_api_get_quote',
                device_data: {
                    productId: productId,
                    memoryInstalled: memoryInstalled,
                    purchasePrice: purchasePrice,
                    purchaseDate: $('#device-purchase-date').val(),
                    serialNumber: $('#device-serial-number').val()
                },
                nonce: mgu_api.nonce
            },
            success: function(response) {
                console.log('DEBUG - Quote response for premium period options:', response);
                if (response.success && response.data) {
                    const quoteData = response.data;
                    console.log('DEBUG - Quote data:', quoteData);
                    
                    // Store quote data globally for policy creation
                    window.currentQuoteData = quoteData;
                    
                    // Show premium period container
                    $('#premium-period-container').show();
                    
                    // Clear existing options
                    $('#premium-period-buttons').empty();
                    
                    // Use base premiums (loss cover handled separately)
                    let monthlyPremium = quoteData.monthlyPremium || 0;
                    let annualPremium = quoteData.annualPremium || 0;
                    
                    // Add radio buttons for monthly and annual premiums
                    const monthlyHtml = `
                        <div class="mgu-api-radio-option">
                            <input type="radio" id="premium-monthly" name="premium-period" value="Month">
                            <label for="premium-monthly">Monthly - £${monthlyPremium.toFixed(2)}</label>
                        </div>
                    `;
                    
                    const annualHtml = `
                        <div class="mgu-api-radio-option">
                            <input type="radio" id="premium-annual" name="premium-period" value="Annual">
                            <label for="premium-annual">Annual - £${annualPremium.toFixed(2)}</label>
                        </div>
                    `;
                    
                    $('#premium-period-buttons').append(monthlyHtml).append(annualHtml);
                    console.log('DEBUG - Premium period buttons added');
                    
                    // Add click handler for premium period options
                    $('.mgu-api-radio-option').on('click', function() {
                        $(this).addClass('selected').siblings().removeClass('selected');
                        $(this).find('input[type="radio"]').prop('checked', true);
                        
                        // Update stored quote data with selected premium period
                        if (window.currentQuoteData) {
                            window.currentQuoteData.selectedPremiumPeriod = $(this).find('input[type="radio"]').val();
                            console.log('DEBUG - Updated quote data with premium period:', window.currentQuoteData.selectedPremiumPeriod);
                        }
                        
                        validateQuoteButton();
                    });
                } else {
                    console.error('DEBUG - Quote request failed:', response);
                }
            },
            error: function(xhr, status, error) {
                console.error('Error getting quote for premium period options:', {xhr, status, error});
            }
        });
    }
    
    // Function to reset device form
    function resetDeviceForm() {
        $('#device-form')[0].reset();
        // Set purchase date to today
        const today = new Date().toISOString().split('T')[0];
        $('#device-purchase-date').val(today);
        
        $('#memory-options-container').hide();
        $('#memory-radio-buttons').empty();
        $('#premium-period-container').hide();
        $('#premium-period-buttons').empty();
        $('#get-quote-btn').prop('disabled', true);
        $('#step-device .mgu-api-step-result').removeClass('error success').empty();
    }
    
    // Function to validate quote button state
    function validateQuoteButton() {
        const purchaseDate = $('#device-purchase-date').val();
        const purchasePrice = $('#device-purchase-price').val();
        const memorySelected = $('input[name="memory-option"]:checked').length > 0;
        
        // Check if purchase date is within 36 months
        let dateValid = false;
        if (purchaseDate) {
            const purchaseDateObj = new Date(purchaseDate);
            const now = new Date();
            const thirtySixMonthsAgo = new Date(now.getFullYear() - 3, now.getMonth(), now.getDate());
            dateValid = purchaseDateObj >= thirtySixMonthsAgo && purchaseDateObj <= now;
            
            // Debug date validation
            console.log('Date Validation Debug:', {
                purchaseDate: purchaseDate,
                purchaseDateObj: purchaseDateObj,
                now: now,
                thirtySixMonthsAgo: thirtySixMonthsAgo,
                isAfter36MonthsAgo: purchaseDateObj >= thirtySixMonthsAgo,
                isBeforeNow: purchaseDateObj <= now,
                dateValid: dateValid
            });
        }
        
        // Check if premium period is selected
        const premiumPeriodSelected = $('input[name="premium-period"]:checked').length > 0;
        
        // Enable button if required fields are filled and date is valid (purchase price is optional)
        const allValid = purchaseDate && memorySelected && premiumPeriodSelected && dateValid;
        
        // Debug logging
        console.log('Quote Button Validation:', {
            purchaseDate: purchaseDate,
            memorySelected: memorySelected,
            premiumPeriodSelected: premiumPeriodSelected,
            dateValid: dateValid,
            allValid: allValid,
            buttonDisabled: !allValid
        });
        
        $('#get-quote-btn').prop('disabled', !allValid);
        
        // Visual feedback - add/remove disabled class
        if (allValid) {
            $('#get-quote-btn').removeClass('disabled').addClass('enabled');
        } else {
            $('#get-quote-btn').removeClass('enabled').addClass('disabled');
        }
    }

    // Function to load manufacturers by gadget type (V2)
    function loadManufacturersByGadgetType(gadgetType) {
        $.ajax({
            url: mgu_api.ajax_url,
            type: 'POST',
            data: {
                action: 'mgu_api_get_manufacturers',
                gadget_type: gadgetType,
                nonce: mgu_api.nonce
            },
            success: function(response) {
                if (response.success) {
                    const manufacturers = response.data.value;
                    // Sort manufacturers alphabetically by name
                    manufacturers.sort(function(a, b) {
                        return a.name.localeCompare(b.name);
                    });
                    
                    const select = $('#manufacturer-select');
                    select.empty().append($('<option></option>').text('Select a manufacturer...'));
                    manufacturers.forEach(function(manufacturer) {
                        select.append($('<option></option>')
                            .attr('value', manufacturer.id)
                            .text(manufacturer.name));
                    });
                } else {
                    showError('step-manufacturer', 'Failed to load manufacturers');
                }
            },
            error: function() {
                showError('step-manufacturer', 'Failed to load manufacturers');
            }
        });
    }

    // Function to load manufacturers for add gadget form
    function loadManufacturersForAddGadget() {
        const gadgetType = $('#add-gadget-type').val();
        if (!gadgetType) return;

        $.ajax({
            url: mgu_api.ajax_url,
            type: 'POST',
            data: {
                action: 'mgu_api_get_manufacturers',
                gadget_type: gadgetType,
                nonce: mgu_api.nonce
            },
            success: function(response) {
                if (response.success) {
                    const manufacturers = response.data.value;
                    // Sort manufacturers alphabetically by name
                    manufacturers.sort(function(a, b) {
                        return a.name.localeCompare(b.name);
                    });
                    
                    const select = $('#add-manufacturer');
                    select.empty().append($('<option></option>').text('Select a manufacturer...'));
                    manufacturers.forEach(function(manufacturer) {
                        select.append($('<option></option>')
                            .attr('value', manufacturer.id)
                            .text(manufacturer.name));
                    });
                }
            }
        });
    }

    // Function to load models
    function loadModels(manufacturerId, gadgetType = null) {
        const data = {
            action: 'mgu_api_get_models',
            manufacturer_id: manufacturerId
        };
        
        if (gadgetType) {
            data.gadget_type = gadgetType;
        }

        data.nonce = mgu_api.nonce;
        
        $.ajax({
            url: mgu_api.ajax_url,
            type: 'POST',
            data: data,
            success: function(response) {
                if (response.success) {
                    const models = response.data.value;
                    
                    // Reverse the array order since API returns in correct order but we want last first
                    models.reverse();
                    
                    const select = $('#model-select');
                    select.empty().append($('<option></option>').text('Select a model...'));
                    models.forEach(function(model) {
                        // Handle V2 API response structure
                        const modelId = model.id;
                        const modelName = model.productName || model.name || model.model || 'Unknown Model';
                        select.append($('<option></option>')
                            .attr('value', modelId)
                            .text(modelName));
                    });
                } else {
                    showError('step-model', 'Failed to load models');
                }
            },
            error: function() {
                showError('step-model', 'Failed to load models');
            }
        });
    }

    // Function to load models for add gadget form
    function loadModelsForAddGadget(manufacturerId, gadgetType) {
        $.ajax({
            url: mgu_api.ajax_url,
            type: 'POST',
            data: {
                action: 'mgu_api_get_models',
                manufacturer_id: manufacturerId,
                gadget_type: gadgetType,
                nonce: mgu_api.nonce
            },
            success: function(response) {
                if (response.success) {
                    const models = response.data.value;
                    
                    // Reverse the array order since API returns in correct order but we want last first
                    models.reverse();
                    
                    const select = $('#add-model');
                    select.empty().append($('<option></option>').text('Select a model...'));
                    models.forEach(function(model) {
                        // Handle V2 API response structure
                        const modelId = model.id;
                        const modelName = model.productName || model.name || model.model || 'Unknown Model';
                        select.append($('<option></option>')
                            .attr('value', modelId)
                            .text(modelName));
                    });
                }
            }
        });
    }

    // Function to get quote using V2 API
    function getQuoteV2(deviceData) {
        $.ajax({
            url: mgu_api.ajax_url,
            type: 'POST',
            data: {
                action: 'mgu_api_get_quote',
                device_data: deviceData,
                nonce: mgu_api.nonce
            },
            success: function(response) {
                if (response.success) {
                    displayQuoteV2(response.data);
                    $('#step-quote').show();
                    // Show/hide loss cover toggle based on availability
                    if (response.data.lossCoverAvailable) {
                        $('#toggle-loss-cover').show();
                        lossCoverEnabled = deviceData.includeLossCover;
                        updateLossCoverButton();
                    }
                } else {
                    showError('step-device', 'Failed to get quote: ' + response.data);
                }
            },
            error: function() {
                showError('step-device', 'Failed to get quote');
            }
        });
    }

    // Function to add gadget to basket
    function addGadgetToBasket(gadgetData) {
        $.ajax({
            url: mgu_api.ajax_url,
            type: 'POST',
            data: {
                action: 'mgu_api_add_gadget_to_basket',
                gadget_data: gadgetData,
                basket_id: currentBasketId,
                nonce: mgu_api.nonce
            },
            success: function(response) {
                if (response.success) {
                    basketItems.push(response.data);
                    displayBasket();
                    $('#step-add-gadget').hide();
                    showSuccess('step-add-gadget', 'Gadget added successfully!');
                } else {
                    showError('step-add-gadget', 'Failed to add gadget: ' + response.data);
                }
            },
            error: function() {
                showError('step-add-gadget', 'Failed to add gadget');
            }
        });
    }

    // Function to toggle loss cover
    function toggleLossCover() {
        const action = lossCoverEnabled ? 'remove_loss_cover' : 'add_loss_cover';
        
        $.ajax({
            url: mgu_api.ajax_url,
            type: 'POST',
            data: {
                action: 'mgu_api_' + action,
                basket_id: currentBasketId,
                nonce: mgu_api.nonce
            },
            success: function(response) {
                if (response.success) {
                    lossCoverEnabled = !lossCoverEnabled;
                    updateLossCoverButton();
                    displayQuoteV2(response.data);
                    showSuccess('step-quote', lossCoverEnabled ? 'Loss cover added' : 'Loss cover removed');
                } else {
                    showError('step-quote', 'Failed to toggle loss cover');
                }
            },
            error: function() {
                showError('step-quote', 'Failed to toggle loss cover');
            }
        });
    }

    // Function to update loss cover button text
    function updateLossCoverButton() {
        const button = $('#toggle-loss-cover');
        button.text(lossCoverEnabled ? 'Remove Loss Cover' : 'Add Loss Cover');
    }

    // Function to display basket items
    function displayBasket() {
        if (basketItems.length === 0) return;
        
        let basketHtml = '<h4>Current Basket:</h4>';
        basketItems.forEach((item, index) => {
            basketHtml += `
                <div class="mgu-api-basket-item">
                    <span>${item.make} ${item.model}</span>
                    <button class="mgu-api-remove-item" onclick="removeBasketItem(${index})">Remove</button>
                </div>
            `;
        });
        
        $('.mgu-api-current-basket').html(basketHtml);
    }

    // Function to display V2 quote
    function displayQuoteV2(quoteData) {
        // Store the quote data globally for policy creation
        window.currentQuoteData = quoteData;
        
        const quoteHtml = `
            <div class="mgu-api-quote-details">
                <h4>Quote Details</h4>
                <p><strong>Monthly Premium:</strong> £${quoteData.monthlyPremium || 'N/A'}</p>
                <p><strong>Annual Premium:</strong> £${quoteData.annualPremium || 'N/A'}</p>
                <p><strong>Damage Excess:</strong> £${quoteData.damageExcess || 'N/A'}</p>
                <p><strong>Theft Excess:</strong> £${quoteData.theftExcess || 'N/A'}</p>
                ${quoteData.lossCoverAvailable ? '<p><strong>Loss Cover Available:</strong> Yes</p>' : ''}
                ${lossCoverEnabled ? '<p><strong>Loss Cover Premium:</strong> £' + (quoteData.lossCoverMonthlyPremium || quoteData.lossCoverAnnualPremium || 'N/A') + '</p>' : ''}
            </div>
        `;
        $('.mgu-api-quote-details').html(quoteHtml);
    }

    // Add gadget type change handler
    $('#add-gadget-type').on('change', function() {
        const gadgetType = $(this).val();
        if (gadgetType) {
            loadManufacturersForAddGadget();
        }
    });

    // Add manufacturer change handler
    $('#add-manufacturer').on('change', function() {
        const manufacturerId = $(this).val();
        const gadgetType = $('#add-gadget-type').val();
        if (manufacturerId && gadgetType) {
            loadModelsForAddGadget(manufacturerId, gadgetType);
        }
    });

    // Global function to remove basket item
    window.removeBasketItem = function(index) {
        if (currentBasketId && basketItems[index]) {
            $.ajax({
                url: mgu_api.ajax_url,
                type: 'POST',
                data: {
                    action: 'mgu_api_remove_policy',
                    basket_id: currentBasketId,
                    policy_id: basketItems[index].id,
                    nonce: mgu_api.nonce
                },
                success: function(response) {
                    if (response.success) {
                        basketItems.splice(index, 1);
                        displayBasket();
                        showSuccess('step-quote', 'Item removed from basket');
                    } else {
                        showError('step-quote', 'Failed to remove item');
                    }
                }
            });
        }
    };

    // Function to get quote
    function getQuote(deviceData) {
        $.ajax({
            url: mgu_api.ajax_url,
            type: 'POST',
            data: {
                action: 'mgu_api_get_quote',
                device_data: deviceData
            },
            success: function(response) {
                if (response.success) {
                    currentQuoteId = response.data.quoteId;
                    displayQuote(response.data);
                    $('#step-quote').show();
                } else {
                    showError('step-device', 'Failed to get quote');
                }
            },
            error: function() {
                showError('step-device', 'Failed to get quote');
            }
        });
    }

    // Function to create policy
    function createPolicy(policyData) {
        $.ajax({
            url: mgu_api.ajax_url,
            type: 'POST',
            data: {
                action: 'mgu_api_create_policy',
                policy_data: policyData
            },
            success: function(response) {
                if (response.success) {
                    showSuccess('step-policy', 'Policy created successfully!');
                } else {
                    showError('step-policy', 'Failed to create policy');
                }
            },
            error: function() {
                showError('step-policy', 'Failed to create policy');
            }
        });
    }

    // Helper function to show success message
    function showSuccess(stepId, message) {
        $(`#${stepId} .mgu-api-step-result`)
            .removeClass('error')
            .addClass('success')
            .html(message);
    }

    // Helper function to show error message
    function showError(stepId, message) {
        $(`#${stepId} .mgu-api-step-result`)
            .removeClass('success')
            .addClass('error')
            .html(message);
    }

    // Helper function to display quote
    function displayQuote(quoteData) {
        const quoteHtml = `
            <div class="mgu-api-quote-details">
                <h4>Quote Details</h4>
                <p>Premium: $${quoteData.premium}</p>
                <p>Coverage: $${quoteData.coverage}</p>
                <p>Duration: ${quoteData.duration} months</p>
            </div>
        `;
        $('.mgu-api-quote-details').html(quoteHtml);
    }
});
</script> 