# Introducing the WCS | MyGadgetUmbrella Insurance API

## 1. Why this API matters
Today's customers expect to protect their smartphones, tablets, and wearables at the point of sale or immediately after a repair. The WCS | MyGadgetUmbrella Insurance API lets you embed tailored insurance offers directly inside your existing sales or repair workflow—strengthening customer loyalty, generating new revenue, and removing the administrative burden of managing policies.

## 2. What the API delivers
- **Live pricing:** Real‑time quotes for loss, theft, and damage cover, available monthly or annually.
- **Automated compliance:** Customer documents, policy wording, and regulatory disclosures are produced and sent for you.
- **Seamless policy issuance:** A single flow confirms cover, generates certificates, and collects payment.
- **Transparent lifecycle:** Endpoints to view, update, or cancel policies keep your records in sync.

## 3. How it works in practice
1. **Match the device:** Your system knows the make and model. A quick lookup returns the exact manufacturer and model codes recognised by the insurer.
2. **Retrieve a quote:** Pass the device codes, sale price, and customer location. The API returns one or more quote options—monthly or annual, with or without loss.
3. **Present and decide:** You show the options on‑screen, answer any questions, and let the customer choose.
4. **Confirm cover:** Send a basket containing customer details and the chosen products. The API responds with a live policy reference, schedule of insurance, and payment confirmation.

Most integrations involve just a few endpoints and complete in under a second.

## 4. Core integration endpoints
A little technical detail for your developers. Each call uses HTTPS with an **Authorization: Bearer** header obtained from our OAuth 2.0 token endpoint. JSON in, JSON out. Sandbox and production differ only in base URL.

| Method   | Endpoint                                 | Purpose                              | Typical request fields                                  | Typical response highlights                |
|----------|------------------------------------------|--------------------------------------|--------------------------------------------------------|--------------------------------------------|
| **GET**  | `/sbapi/v1/manufacturers`                | List supported manufacturers         | `GadgetType`                                           | `ManufacturerId`, `Name`                   |
| **GET**  | `/sbapi/v1/models`                       | List models for a manufacturer       | `ManufacturerId`, `GadgetType`                         | `Model`, `MinSalePrice`, `MaxSalePrice`    |
| **GET**  | `/sbapi/v1/gadgetPremiums`               | Price a device (get quote)           | `ManufacturerId`, `GadgetType`, `Model`                | `PremiumId`, `TotalPremium`, `Options[]`   |
| **POST** | `/sbapi/v1/newCustomer`                  | Register a customer                  | Customer details (name, contact, address, etc.)        | `CustomerId`                               |
| **GET**  | `/sbapi/v1/openBasket`                   | Create a basket for policies         | `CustomerId`, `PremiumPeriod`, `IncludeLossCover`      | `BasketId`                                 |
| **POST** | `/sbapi/v1/addGadgets`                   | Add gadgets to a basket              | Array of gadgets (with `BasketId`, model, price, etc.) | Updated basket details                     |
| **GET**  | `/sbapi/v1/confirm`                      | Confirm and finalise the basket      | `BasketId`                                             | Policy references, documents, payment info  |
| **POST** | `/sbapi/v1/policies`                     | Create a new policy                  | Policy details                                         | Policy confirmation                        |

*Example — retrieve a quote:*

```bash
curl -X GET "https://sandbox.api.mygadgetumbrella.com/sbapi/v1/gadgetPremiums?ManufacturerId=APL&GadgetType=MobilePhone&Model=IPH14-128" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json"
```

The response returns available premiums, ready to present to the customer.

## 5. Built for busy retailers and repairers
- **Simple payloads:** Clean JSON objects with clear validation rules, making front‑end or middleware mapping straightforward.
- **Scalable cloud infrastructure:** 99.9% uptime, tight SLA, and ISO‑27001‑accredited hosting.
- **Security first:** OAuth 2.0 bearer tokens, IP whitelisting on request, and TLS 1.3 as standard.

## 6. Getting started
- **Create a sandbox key** in minutes and experiment with the interactive Swagger playground.
- **Use our Postman collection,** examples, and self‑service developer portal to test live quotes.
- **Move to production** when ready with a single change of base URL.

## 7. Next steps
If you would like to explore partnership opportunities, see a demo, or start a pilot, we would love to talk. Please contact our Business Integration team at **[api@mygadgetumbrella.co.uk](mailto:api@mygadgetumbrella.co.uk)** or call **+44 (0)20 1234 5678**.

Together, we can give your customers peace of mind where and when they need it most. 