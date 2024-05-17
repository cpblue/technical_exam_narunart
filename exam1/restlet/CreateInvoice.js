/**
 * @NApiVersion 2.1
 */
define(["N/record", "N/search"], function (record, search) {
  function createInvoice(data) {
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
  }

  function findCustomer(data) {
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
  }
  return createInvoice;
});
