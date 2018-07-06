import filterForm from "./modules/filterForm";

const getters = {
	userInfo: state => state.user.userInfo,
	roles: state => state.permission.roles,
	addRouters: state => state.permission.addRouters,
	filterForm: state => state.filterForm
}
export default getters
