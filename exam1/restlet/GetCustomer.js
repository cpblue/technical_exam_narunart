/**
 * @NApiVersion 2.x
 */
define(["N/record", "N/search"], function (record, search) {
  function getCustomerById(customerId) {
    try {
      var customer = record.load({
        type: record.Type.CUSTOMER,
        id: customerId,
      });
      var customerData = {
        id: customer.id,
        entityId: customer.getValue("entityid"),
        companyName: customer.getValue("companyname"),
        email: customer.getValue("email"),
        phone: customer.getValue("phone"),
        address: customer.getValue("address"),
      };
      return { success: true, customer: customerData };
    } catch (e) {
      return { success: false, message: e.message };
    }
  }

  function getCustomerByExternalId(externalId) {
    try {
      var customerSearch = search.create({
        type: search.Type.CUSTOMER,
        filters: [["externalid", search.Operator.IS, externalId]],
        columns: ["internalid"],
      });
      var result = customerSearch.run().getRange({ start: 0, end: 1 });
      if (result.length > 0) {
        var customerId = result[0].getValue("internalid");
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
