/**
 * @NApiVersion 2.1
 */
define(["N/record"], function (record) {
  function createCustomer(data) {
    try {
      let customer = record.create({
        type: record.Type.CUSTOMER,
      });
      log.debug({
        title: "createCustomer",
        details: JSON.stringify(data),
      });
      //TODO: add validation functions

      customer.setValue({ fieldId: "subsidiary", value: data.subsidiary });
      customer.setValue({ fieldId: "isperson", value: "F" });
      customer.setValue({ fieldId: "externalid", value: data.externalId });
      customer.setValue({ fieldId: "companyname", value: data.companyName });
      customer.setValue({ fieldId: "email", value: data.email });
      let customerId = customer.save();
      return { success: true, customerId: customerId };
    } catch (e) {
      log.error("Error creating customer", e.message);
      return { success: false, message: e.message };
    }
  }

  return createCustomer;
});
