<?php
if (!defined('ABSPATH')) {
    exit;
}
?>

<div class="mgu-api-test-flow">
    <div class="mgu-api-step" id="step-gadget-type">
        <h3>Step 1: Select Device Type</h3>
        <select id="gadget-type-select" class="mgu-api-select">
            <option value="">Select a device type...</option>
            <option value="MobilePhone">Mobile Phone</option>
            <option value="Laptop">Laptop</option>
            <option value="Tablet">Tablet</option>
            <option value="VRHeadset">VR Headset</option>
            <option value="Watch">Watch</option>
            <option value="GamesConsole">Games Console</option>
        </select>
        <div class="mgu-api-step-result"></div>
    </div>

    <div class="mgu-api-step" id="step-manufacturer" style="display: none;">
        <h3>Step 2: Select Manufacturer</h3>
        <select id="manufacturer-select" class="mgu-api-select">
            <option value="">Select a manufacturer...</option>
        </select>
        <div class="mgu-api-step-result"></div>
    </div>

    <div class="mgu-api-step" id="step-model" style="display: none;">
        <h3>Step 3: Select Model</h3>
        <select id="model-select" class="mgu-api-select">
            <option value="">Select a model...</option>
        </select>
        <div class="mgu-api-step-result"></div>
    </div>

    <div class="mgu-api-step" id="step-device" style="display: none;">
        <h3>Step 4: Device Details</h3>
        <form id="device-form">
            <div class="mgu-api-form-group">
                <label for="device-purchase-date">Purchase Date</label>
                <input type="date" id="device-purchase-date" required>
            </div>
            <div class="mgu-api-form-group">
                <label for="device-purchase-price">Purchase Price</label>
                <input type="number" id="device-purchase-price" step="0.01" required>
            </div>
            <button type="submit" class="mgu-api-button">Get Quote</button>
        </form>
        <div class="mgu-api-step-result"></div>
    </div>

    <div class="mgu-api-step" id="step-quote" style="display: none;">
        <h3>Step 5: Review Quote</h3>
        <div class="mgu-api-quote-details"></div>
        <button id="accept-quote" class="mgu-api-button">Accept Quote</button>
        <div class="mgu-api-step-result"></div>
    </div>

    <div class="mgu-api-step" id="step-policy" style="display: none;">
        <h3>Step 6: Create Policy</h3>
        <form id="policy-form">
            <div class="mgu-api-form-group">
                <label for="policy-first-name">First Name</label>
                <input type="text" id="policy-first-name" required>
            </div>
            <div class="mgu-api-form-group">
                <label for="policy-last-name">Last Name</label>
                <input type="text" id="policy-last-name" required>
            </div>
            <div class="mgu-api-form-group">
                <label for="policy-email">Email</label>
                <input type="email" id="policy-email" required>
            </div>
            <div class="mgu-api-form-group">
                <label for="policy-phone">Phone</label>
                <input type="tel" id="policy-phone" required>
            </div>
            <button type="submit" class="mgu-api-button">Create Policy</button>
        </form>
        <div class="mgu-api-step-result"></div>
    </div>
</div> 