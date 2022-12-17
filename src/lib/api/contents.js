import client from "./client";

// 一覧取得（全件）
export const getContents = () => {
  return client.get(`/contents/`);
}

// 一覧取得（全件）
export const getContentsAll = (scope, uid) => {
  return client.get(`/contents/index_all?scope=${scope}&uid=${uid}`);
}

// 一覧取得（タイトル指定（部分一致））
export const getContentsWhereTitle = (title, scope, uid) => {
  return client.get(`/contents/index_wheretitle?title=${title}&scope=${scope}&uid=${uid}`);
}

// 一覧取得（本文指定（部分一致））
export const getContentsWhereCont = (cont, scope, uid) => {
  return client.get(`/contents/index_wherecont?cont=${cont}&scope=${scope}&uid=${uid}`);
}

// 一覧取得（タグ指定）
export const getContentsWhereTag = (tag, scope, uid) => {
  return client.get(`/contents/index_wheretag?tag=${tag}&scope=${scope}&uid=${uid}`);
}

// 個別取得（ID指定）
export const getContentWhereId = (id) => {
  return client.get(`/contents/${id}`);
}

// 新規作成
export const createContent = (params) => {
  return client.post(`/contents/create_content/`, params);
};

// 更新（ID指定）
export const updateContent = (id, params) => {
  return client.patch(`/contents/${id}/update_content/`, params);
};

// 削除（ID指定）
export const deleteContent = (id) => {
  return client.delete(`/contents/${id}`);
}
