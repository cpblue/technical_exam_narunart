/**
 * @module DeleteCustomer
 * @description This module is responsible for deleting customer data.
 * @NApiVersion 2.1
 */
define(["N/record", "N/search"], function (record, search) {
  /**
   * @exports DeleteCustomer
   */
  let DeleteCustomer = {};

  /**
   * Deletes a customer by its internal id.
   * @param {string} customerId - netsuite customer internal id.
   * @returns {Object} - The response object.
   * @returns {boolean} success - Indicates whether the request was successful.
   * @returns {string} message - The message associated with the response.
   */
  DeleteCustomer.byId = function (customerId) {
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
  };

  /**
   * Deletes a customer by its external id.
   * @param {string} externalId - customer externalId.
   * @returns {Object} - The response object.
   * @returns {boolean} success - Indicates whether the request was successful.
   * @returns {string} message - The message associated with the response.
   */
  DeleteCustomer.byExternalId = function (externalId) {
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
        return DeleteCustomer.byId(customerId);
      } else {
        return { success: false, message: "Customer not found" };
      }
    } catch (e) {
      return { success: false, message: e.message };
    }
  };

  return DeleteCustomer;
});
