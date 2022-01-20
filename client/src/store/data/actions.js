import Axios from "axios";

export async function loadPoints({ commit }) {
  const response = await Axios.get("/api/points");

  commit("SET_POINTS", response.data);
}
export async function loadAllPoints({ commit }) {
  const response = await Axios.get("/api/points/all");

  commit("SET_ALL_POINTS", response.data);
}
