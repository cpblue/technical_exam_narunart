/**
 * @module UpdateCustomer
 * @description This module is responsible for updating customer data.
 * @NApiVersion 2.1
 */
define(["N/record", "N/search"], function (record, search) {
  /**
   * @exports UpdateCustomer
   */
  let UpdateCustomer = {};

  /**
   * Represents customer data.
   * @param {string} customerId - netsuite customer internal id.
   * @param {Object} data - The data to update.
   * @returns {Object} - The response object.
   */
  UpdateCustomer.byId = function (customerId, data) {
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
  };

  /**
   * Represents customer data.
   * @param {string} externalId - customer externalId.
   * @param {Object} data - The data to update.
   * @returns {Object} - The response object.
   */
  UpdateCustomer.byExternalId = function (externalId, data) {
    try {
      let customerSearch = search.create({
        type: search.Type.CUSTOMER,
        filters: [["externalid", search.Operator.IS, externalId]],
        columns: ["internalid"],
      });
      let result = customerSearch.run().getRange({ start: 0, end: 1 });
      if (result.length > 0) {
        let customerId = result[0].getValue("internalid");
        return UpdateCustomer.byId(customerId, data);
      } else {
        return { success: false, message: "Customer not found" };
      }
    } catch (e) {
      return { success: false, message: e.message };
    }
  };

  return UpdateCustomer;
});
