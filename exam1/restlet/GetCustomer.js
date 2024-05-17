/**
 * @module GetCustomer
 * @description This module is responsible for getting customer data.
 * @NApiVersion 2.1
 */
define(["N/record", "N/search"], function (record, search) {
  /**
   * @exports GetCustomer
   */
  let GetCustomer = {};

  /**
   * Represents customer data.
   * @param {string} customerId - netsuite customer internal id.
   * @returns {Object} - The response object.
   */
  GetCustomer.byId = function (customerId) {
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
  };

  /**
   * Represents customer data.
   * @param {string} externalId - customer externalId.
   * @returns {Object} - The response object.
   */
  GetCustomer.byExternalId = function (externalId) {
    try {
      let customerSearch = search.create({
        type: search.Type.CUSTOMER,
        filters: [["externalid", search.Operator.IS, externalId]],
        columns: ["internalid"],
      });
      let result = customerSearch.run().getRange({ start: 0, end: 1 });
      if (result.length > 0) {
        let customerId = result[0].getValue("internalid");
        return GetCustomer.byId(customerId);
      } else {
        return { success: false, message: "Customer not found" };
      }
    } catch (e) {
      return { success: false, message: e.message };
    }
  };

  return GetCustomer;
});
