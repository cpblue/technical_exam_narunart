/**
 * @NApiVersion 2.x
 * @NScriptType Restlet
 */
define([
  "N/log",
  "./GetCustomer",
  "./CreateCustomer",
  "./CreateCustomRecord",
  "./CreateInvoice",
  "./UpdateCustomer",
  "./DeleteCustomer",
], function (
  log,
  getCustomer,
  createCustomer,
  createCustomRecord,
  createInvoice,
  updateCustomer,
  deleteCustomer
) {
  function handleGet(requestParams) {
    if (requestParams.externalId) {
      return getCustomer.byExternalId(requestParams.externalId);
    } else if (requestParams.customerId) {
      return getCustomer.byId(requestParams.customerId);
    }
    return { success: false, message: "Invalid GET request" };
  }

  function handlePost(requestBody) {
    var action = requestBody.action;
    var data = requestBody.data;

    if (action === "createCustomer") {
      return createCustomer(data);
    } else if (action === "createCustomRecord") {
      return createCustomRecord(data);
    } else if (action === "createInvoice") {
      return createInvoice(data);
    }
    return { success: false, message: "Invalid POST request" };
  }

  function handlePut(requestBody) {
    var data = requestBody.data;
    if (data.externalId) {
      return updateCustomer.byExternalId(data.externalId, data);
    } else if (data.customerId) {
      return updateCustomer.byId(data.customerId, data);
    }
    return { success: false, message: "Invalid PUT request" };
  }

  function handleDelete(requestParams) {
    if (requestParams.externalId) {
      return deleteCustomer.byExternalId(requestParams.externalId);
    } else if (requestParams.customerId) {
      return deleteCustomer.byId(requestParams.customerId);
    }
    return { success: false, message: "Invalid DELETE request" };
  }

  return {
    get: handleGet,
    post: handlePost,
    put: handlePut,
    delete: handleDelete,
  };
});
