/**
 * @NApiVersion 2.x
 */
define(["N/record", "N/search"], function (record, search) {
  function deleteCustomerById(customerId) {
    try {
      record.delete({
        type: record.Type.CUSTOMER,
        id: customerId,
      });
      return { success: true };
    } catch (e) {
      return { success: false, message: e.message };
    }
  }

  function deleteCustomerByExternalId(externalId) {
    try {
      var customerSearch = search.create({
        type: search.Type.CUSTOMER,
        filters: [["externalid", search.Operator.IS, externalId]],
        columns: ["internalid"],
      });
      var result = customerSearch.run().getRange({ start: 0, end: 1 });
      if (result.length > 0) {
        var customerId = result[0].getValue("internalid");
        return deleteCustomerById(customerId);
      } else {
        return { success: false, message: "Customer not found" };
      }
    } catch (e) {
      return { success: false, message: e.message };
    }
  }

  return {
    byId: deleteCustomerById,
    byExternalId: deleteCustomerByExternalId,
  };
});
