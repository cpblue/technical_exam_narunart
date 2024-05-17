/**
 * @NApiVersion 2.1
 */
define(["N/record", "N/search"], function (record, search) {
  function updateCustomerById(customerId, data) {
    try {
      let customer = record.load({
        type: record.Type.CUSTOMER,
        id: customerId,
      });
      //TODO: add validation functions
      for (let field in data) {
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
      let customerSearch = search.create({
        type: search.Type.CUSTOMER,
        filters: [["externalid", search.Operator.IS, externalId]],
        columns: ["internalid"],
      });
      let result = customerSearch.run().getRange({ start: 0, end: 1 });
      if (result.length > 0) {
        let customerId = result[0].getValue("internalid");
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
