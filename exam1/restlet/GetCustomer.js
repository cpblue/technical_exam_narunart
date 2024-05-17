/**
 * @NApiVersion 2.1
 */
define(["N/record", "N/search"], function (record, search) {
  function getCustomerById(customerId) {
    try {
      let customer = record.load({
        type: record.Type.CUSTOMER,
        id: customerId,
      });
      let customerData = {
        id: customer.id,
        entityId: customer.getValue("entityid"),
        companyName: customer.getValue("companyname"),
        email: customer.getValue("email"),
        phone: customer.getValue("phone"),
        address: customer.getValue("address"),
        externalId: customer.getValue("externalid"),
      };
      return { success: true, customer: customerData };
    } catch (e) {
      log.error("Error getting customer", e.message);
      return { success: false, message: e.message };
    }
  }

  function getCustomerByExternalId(externalId) {
    try {
      let customerSearch = search.create({
        type: search.Type.CUSTOMER,
        filters: [["externalid", search.Operator.IS, externalId]],
        columns: ["internalid"],
      });
      let result = customerSearch.run().getRange({ start: 0, end: 1 });
      if (result.length > 0) {
        let customerId = result[0].getValue("internalid");
        return getCustomerById(customerId);
      } else {
        return { success: false, message: "Customer not found" };
      }
    } catch (e) {
      return { success: false, message: e.message };
    }
  }

  return {
    byId: getCustomerById,
    byExternalId: getCustomerByExternalId,
  };
});
