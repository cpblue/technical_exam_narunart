/**
 * @module CreateInvoice
 * @description This module is responsible for creating an invoice.
 * @NApiVersion 2.1
 */
define(["N/record", "N/search"], function (record, search) {
  /**
   * @exports CreateInvoice
   */
  let CreateInvoice = {};

  /**
   * Creates a new invoice.
   * @param {Object} data - The data to create the invoice.
   * @returns {Object} - The response object.
   * @returns {boolean} success - Indicates whether the request was successful.
   * @returns {string} message - The message associated with the response.
   * @returns {string} invoiceId - The internal id of the created invoice.
   * @returns {string} customerId - The internal id of the customer.
   */
  CreateInvoice.createInvoice = function (data) {
    try {
      let customerId = findCustomer(data);
      let invoice = record.create({
        type: record.Type.INVOICE,
      });
      //TODO: add validation functions
      invoice.setValue({ fieldId: "entity", value: customerId });
      invoice.setValue({ fieldId: "trandate", value: data.tranDate });
      invoice.setValue({ fieldId: "memo", value: data.memo });
      invoice.setValue({ fieldId: "tranid", value: data.tranId });
      invoice.setValue({ fieldId: "externalid", value: data.tranId });
      //TODO: find Account Management Fee to charge the Customer
      invoice.selectNewLine({ sublistId: "item" });
      invoice.setCurrentSublistValue({
        sublistId: "item",
        fieldId: "item",
        value: data.item,
      });
      invoice.setCurrentSublistValue({
        sublistId: "item",
        fieldId: "amount",
        value: data.amount,
      });
      invoice.commitLine({ sublistId: "item" });
      let invoiceId = invoice.save();
      return { success: true, invoiceId: invoiceId };
    } catch (e) {
      return { success: false, message: e.message };
    }
  };

  /**
   * Finds the customer by its internal id or external id.
   * @param {Object} data - The data to find the customer.
   * @returns {string} - The internal id of the customer.
   */
  CreateInvoice.findCustomer = function (data) {
    let customerId;
    if (data.externalId) {
      let customerSearch = search.create({
        type: search.Type.CUSTOMER,
        filters: [["externalid", search.Operator.IS, data.externalId]],
        columns: ["internalid"],
      });
      let result = customerSearch.run().getRange({ start: 0, end: 1 });
      if (result.length > 0) {
        customerId = result[0].getValue("internalid");
      } else {
        return { success: false, message: "Customer not found" };
      }
    } else {
      customerId = data.customerId;
    }
    return customerId;
  };

  return CreateInvoice;
});
