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
    <h2>Insurance Policy Flow Test</h2>

    <div class="mgu-api-steps">
        <!-- Step 1: Gadget Type Selection -->
        <div id="step-gadget-type" class="mgu-api-step">
            <h3>Step 1: Select Gadget Type</h3>
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
            <h3>Step 2: Select Manufacturer</h3>
            <select id="manufacturer-select" class="mgu-api-select">
                <option value="">Select a manufacturer...</option>
            </select>
            <div class="mgu-api-step-result"></div>
        </div>

        <!-- Step 3: Model Selection -->
        <div class="mgu-api-step" id="step-model" style="display: none;">
            <h3>Step 3: Select Model</h3>
            <select id="model-select" class="mgu-api-select">
                <option value="">Select a model...</option>
            </select>
            <div class="mgu-api-step-result"></div>
        </div>

        <!-- Step 4: Device Details -->
        <div id="step-device" class="mgu-api-step" style="display: none;">
            <h3>Step 4: Device Details</h3>
            <form id="device-form" class="mgu-api-form">
                <div class="mgu-api-form-group">
                    <label for="device-purchase-date">Purchase Date (Optional)</label>
                    <input type="date" id="device-purchase-date" class="mgu-api-input">
                </div>
                <div class="mgu-api-form-group">
                    <label for="device-purchase-price">Purchase Price (Optional)</label>
                    <input type="number" id="device-purchase-price" class="mgu-api-input" min="0" step="0.01">
                </div>
                <button type="submit" class="mgu-api-button">Get Quote</button>
            </form>
            <div class="mgu-api-step-result"></div>
        </div>

        <!-- Step 5: Quote Display -->
        <div class="mgu-api-step" id="step-quote" style="display: none;">
            <h3>Step 5: Insurance Quote</h3>
            <div class="mgu-api-quote-details"></div>
            <button id="accept-quote" class="mgu-api-button">Accept Quote</button>
            <div class="mgu-api-step-result"></div>
        </div>

        <!-- Step 6: Policy Creation -->
        <div class="mgu-api-step" id="step-policy" style="display: none;">
            <h3>Step 6: Create Policy</h3>
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
                <button type="submit" class="mgu-api-button">Create Policy</button>
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
</style>

<script>
jQuery(document).ready(function($) {
    // Load manufacturers on page load
    loadManufacturers();

    // Manufacturer change handler
    $('#manufacturer-select').on('change', function() {
        const manufacturerId = $(this).val();
        if (manufacturerId) {
            loadModels(manufacturerId);
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
        if (modelId) {
            $('#step-device').show();
        } else {
            $('#step-device').hide();
            $('#step-quote').hide();
            $('#step-policy').hide();
        }
    });

    // Device form submit handler
    $('#device-form').on('submit', function(e) {
        e.preventDefault();
        const deviceData = {
            manufacturerId: $('#manufacturer-select').val(),
            modelId: $('#model-select').val(),
            purchaseDate: $('#device-purchase-date').val(),
            purchasePrice: $('#device-purchase-price').val()
        };
        getQuote(deviceData);
    });

    // Quote accept handler
    $('#accept-quote').on('click', function() {
        $('#step-policy').show();
    });

    // Policy form submit handler
    $('#policy-form').on('submit', function(e) {
        e.preventDefault();
        const policyData = {
            quoteId: currentQuoteId, // This will be set when we get the quote
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
            marketingConsent: $('#policy-marketing').is(':checked') ? 'Yes' : 'No'
        };
        createPolicy(policyData);
    });

    // Function to load manufacturers
    function loadManufacturers() {
        $.ajax({
            url: mgu_api.ajax_url,
            type: 'POST',
            data: {
                action: 'mgu_api_get_manufacturers'
            },
            success: function(response) {
                if (response.success) {
                    const manufacturers = response.data.value;
                    const select = $('#manufacturer-select');
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

    // Function to load models
    function loadModels(manufacturerId) {
        $.ajax({
            url: mgu_api.ajax_url,
            type: 'POST',
            data: {
                action: 'mgu_api_get_models',
                manufacturer_id: manufacturerId
            },
            success: function(response) {
                if (response.success) {
                    const models = response.data.value;
                    const select = $('#model-select');
                    select.empty().append($('<option></option>').text('Select a model...'));
                    models.forEach(function(model) {
                        select.append($('<option></option>')
                            .attr('value', model.id)
                            .text(model.name));
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