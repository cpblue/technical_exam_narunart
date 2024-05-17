/**
 * @NApiVersion 2.x
 */
define(["N/record"], function (record) {
  function createCustomer(data) {
    try {
      var customer = record.create({
        type: record.Type.CUSTOMER,
      });
      customer.setValue({ fieldId: "externalid", value: data.externalId });
      customer.setValue({ fieldId: "companyname", value: data.companyName });
      customer.setValue({ fieldId: "email", value: data.email });
      customer.setValue({ fieldId: "phone", value: data.phone });
      if (data.address) {
        var addressSubrecord = customer.getSubrecord({
          fieldId: "addressbook",
        });
        addressSubrecord.setValue({
          fieldId: "addr1",
          value: data.address.addr1,
        });
        addressSubrecord.setValue({
          fieldId: "city",
          value: data.address.city,
        });
        addressSubrecord.setValue({
          fieldId: "state",
          value: data.address.state,
        });
        addressSubrecord.setValue({ fieldId: "zip", value: data.address.zip });
        addressSubrecord.setValue({
          fieldId: "country",
          value: data.address.country,
        });
      }
      var customerId = customer.save();
      return { success: true, customerId: customerId };
    } catch (e) {
      return { success: false, message: e.message };
    }
  }

  return createCustomer;
});
