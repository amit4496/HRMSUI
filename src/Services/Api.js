import { BASE_URL } from "../pages/helper";

export async function postData(data, urlPath) {
  console.log(urlPath,  localStorage.getItem("token"), "Pathh");
  const res = await fetch(BASE_URL + urlPath, {
    method: "POST",
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
      Origin: process.env.ORIGIN,
      Authorization: "Bearer " + localStorage?.getItem("token"),
      host: BASE_URL,
      Accept: "*/*",
    },
    body: JSON.stringify(data),
  });

  return await res;
}


export async function deleteData(data, urlPath) {
  const res = await fetch(BASE_URL + urlPath, {
    method: "delete",
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
      Origin: process.env.ORIGIN,
      Authorization: "Bearer " + localStorage.getItem("token"),
      host: BASE_URL,
      Accept: "*/*",
      
    },
    body: JSON.stringify(data),
  });

  return await res;
}
export async function patchData(data, urlPath) {
  const res = await fetch(BASE_URL + urlPath, {
    method: "PATCH",
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
      Origin: process.env.ORIGIN,
      Authorization: "Bearer " + localStorage.getItem("token"),
      host: BASE_URL,
      Accept: "*/*",
    },
    body: JSON.stringify(data),
  });

  return await res;
}

export async function postDataAuth(data, urlPath) {
  const res = await fetch(BASE_URL + urlPath, {
    method: "POST",
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
      // Origin: process.env.ORIGIN,
      Origin: process.env.ORIGIN ,
      Authorization: "Bearer " + localStorage.setItem("token"),
      host: BASE_URL,
      Accept: "*/*",
      // AcceptEncoding: "gzip, deflate, br"
    },
    body: JSON.stringify(data),
  });

  return await res;
}

export async function getData(urlPath) {
  let accessTokenKey = "";
  accessTokenKey = localStorage.getItem("token");
  const res = await fetch(BASE_URL + urlPath, {
    method: "GET",
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
     
     Authorization: "Bearer " + accessTokenKey,
    },
  });
  return await res;
}


