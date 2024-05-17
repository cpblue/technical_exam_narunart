/**
 * @NApiVersion 2.1
 */
define(["N/record", "N/search"], function (record, search) {
  function deleteCustomerById(customerId) {
    try {
      log.warn("Deleting customer with id: " + customerId);
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
      log.warn("Deleting customer with externalId: " + externalId);
      let customerSearch = search.create({
        type: search.Type.CUSTOMER,
        filters: [["externalid", search.Operator.IS, externalId]],
        columns: ["internalid"],
      });
      let result = customerSearch.run().getRange({ start: 0, end: 1 });
      if (result.length > 0) {
        let customerId = result[0].getValue("internalid");
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
