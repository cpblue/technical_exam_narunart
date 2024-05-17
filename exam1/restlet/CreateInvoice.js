/**
 * @NApiVersion 2.x
 */
define(["N/record", "N/search"], function (record, search) {
  function createInvoice(data) {
    try {
      var customerId;
      if (data.externalId) {
        var customerSearch = search.create({
          type: search.Type.CUSTOMER,
          filters: [["externalid", search.Operator.IS, data.externalId]],
          columns: ["internalid"],
        });
        var result = customerSearch.run().getRange({ start: 0, end: 1 });
        if (result.length > 0) {
          customerId = result[0].getValue("internalid");
        } else {
          return { success: false, message: "Customer not found" };
        }
      } else {
        customerId = data.customerId;
      }

      var invoice = record.create({
        type: record.Type.INVOICE,
      });
      invoice.setValue({ fieldId: "entity", value: customerId });
      invoice.setValue({ fieldId: "trandate", value: data.tranDate });
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
      var invoiceId = invoice.save();
      return { success: true, invoiceId: invoiceId };
    } catch (e) {
      return { success: false, message: e.message };
    }
  }

  return createInvoice;
});
