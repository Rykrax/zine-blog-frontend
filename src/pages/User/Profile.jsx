import { useEffect } from "react";
import { userApi } from "../../routes/api";

const Profile = () => {
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await userApi();
                console.log(res.user);
            } catch (error) {

            }
        }
        fetchData();
    }, []);

}

export default Profile;