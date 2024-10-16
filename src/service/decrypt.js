import Security from "../security/security";

export const decryptData = async (response) => {  
  try {
    if (response.data.mac !== undefined) {      
      response.data = await new Security().decrypt(response);
      return response.data;
    }
    return response;
  } catch (error) {
    console.error(error)
  }
}
