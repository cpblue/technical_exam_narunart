/**
 * @NApiVersion 2.1
 * @NScriptType Restlet
 */
define([
  "N/log",
  "./GetCustomer",
  "./CreateCustomer",
  "./CreateInvoice",
  "./UpdateCustomer",
  "./DeleteCustomer",
], function (
  log,
  getCustomer,
  createCustomer,
  createInvoice,
  updateCustomer,
  deleteCustomer
) {
  function handleGet(requestParams) {
    let action = requestParams.action;

    if (action === "getCustomer") {
      if (requestParams.externalId) {
        return getCustomer.byExternalId(requestParams.externalId);
      } else if (requestParams.customerId) {
        return getCustomer.byId(requestParams.customerId);
      }
    }

    return { success: false, message: "Invalid GET request" };
  }

  function handlePost(requestBody) {
    let action = requestBody.action;
    let data = requestBody.data;

    if (action === "createCustomer") {
      return createCustomer(data);
    } else if (action === "createInvoice") {
      return createInvoice(data);
    }
    return { success: false, message: "Invalid POST request" };
  }

  function handlePut(requestBody) {
    let data = requestBody.data;
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
