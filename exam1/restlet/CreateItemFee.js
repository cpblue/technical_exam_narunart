/**
 * @NApiVersion 2.1
 */
define(["N/record", "N/search"], function (record, search) {
  function CreateItemFee(data) {
    try {
      let customerId = findCustomer(data);
      let itemFee = record.create({
        type: "customrecord_account_management_fee",
      });
      //TODO: add validation functions
      //TODO: convert to sublist for multiple items
      //TODO: function to find item internalid by name
      // for now, assuming it is hardcoded single service item
      itemFee.setValue({
        fieldId: "custrecord_account_management_item",
        value: data.item,
      });
      itemFee.setValue({
        fieldId: "custrecord_account_management_item_amount",
        value: data.amount,
      });
      itemFee.setValue({
        fieldId: "custrecord_account_responsible_party",
        value: customerId,
      });
      itemFee.setValue({
        fieldId: "custrecord_account_management_fee_process_date",
        value: data.processDate,
      });
      let itemFeeId = itemFee.save();

      return { success: true, internalid: itemFeeId };
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
  return CreateItemFee;
});
