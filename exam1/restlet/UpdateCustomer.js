/**
 * @NApiVersion 2.x
 */
define(["N/record", "N/search"], function (record, search) {
  function updateCustomerById(customerId, data) {
    try {
      var customer = record.load({
        type: record.Type.CUSTOMER,
        id: customerId,
      });
      for (var field in data) {
        if (
          data.hasOwnProperty(field) &&
          field !== "customerId" &&
          field !== "externalId"
        ) {
          customer.setValue({ fieldId: field, value: data[field] });
        }
      }
      customer.save();
      return { success: true };
    } catch (e) {
      return { success: false, message: e.message };
    }
  }

  function updateCustomerByExternalId(externalId, data) {
    try {
      var customerSearch = search.create({
        type: search.Type.CUSTOMER,
        filters: [["externalid", search.Operator.IS, externalId]],
        columns: ["internalid"],
      });
      var result = customerSearch.run().getRange({ start: 0, end: 1 });
      if (result.length > 0) {
        var customerId = result[0].getValue("internalid");
        return updateCustomerById(customerId, data);
      } else {
        return { success: false, message: "Customer not found" };
      }
    } catch (e) {
      return { success: false, message: e.message };
    }
  }

  return {
    byId: updateCustomerById,
    byExternalId: updateCustomerByExternalId,
  };
});
