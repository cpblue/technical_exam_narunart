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
      invoice.setValue({ fieldId: "memo", value: data.memo });
      invoice.setValue({ fieldId: "tranid", value: data.tranId });
      invoice.setValue({ fieldId: "externalid", value: data.tranId });

      let accountManagementFeeItem = CreateInvoice.findItemFee(customerId);
      invoice.selectNewLine({ sublistId: "item" });
      invoice.setCurrentSublistValue({
        sublistId: "item",
        fieldId: "item",
        value: accountManagementFeeItem.item,
      });
      invoice.setCurrentSublistValue({
        sublistId: "item",
        fieldId: "amount",
        value: accountManagementFeeItem.amount,
      });
      invoice.commitLine({ sublistId: "item" });
      invoice.setValue({
        fieldId: "trandate",
        value: accountManagementFeeItem.processDate,
      });
      let invoiceId = invoice.save();
      return { success: true, invoiceId: invoiceId };
    } catch (e) {
      return { success: false, message: e.message };
    }
  };

  /**
   * Finds the account management fee item for the customer.
   * @param {string} customerId - The internal id of the customer.
   * @returns {Object} - The account management fee item.
   * @returns {string} item - The internal id of the item.
   * @returns {string} amount - The amount of the item.
   * @returns {string} processDate - The process date of the item.
   * @throws {Error} - If the account management fee is not found.
   */
  CreateInvoice.findItemFee = function (customerId) {
    let itemFeeSearch = search.create({
      type: "customrecord_account_management_fee",
      filters: [
        [
          "custrecord_account_responsible_party",
          search.Operator.IS,
          customerId,
        ],
      ],
      columns: [
        "custrecord_account_management_item",
        "custrecord_account_management_item_amount",
        "custrecord_account_management_fee_process_date",
      ],
    });
    let result = itemFeeSearch.run().getRange({ start: 0, end: 1 });
    if (result.length > 0) {
      //TODO: update to handle multiple items
      return {
        item: result[0].getValue("custrecord_account_management_item"),
        amount: result[0].getValue("custrecord_account_management_item_amount"),
        processDate: result[0].getValue(
          "custrecord_account_management_fee_process_date"
        ),
      };
    } else {
      throw new Error("Account Management Fee not found");
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
