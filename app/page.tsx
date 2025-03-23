import JoinRoomForm from "@/components/forms/JoinRoomForm";
import AddRoomForm from "@/components/forms/AddRoomForm";
import DataInitialize from "@/components/function/DataInitialize";
import ComfirmLocalStorage from "@/components/function/ComfirmLocalStorage";

const Home = () => {

  return (
    <div>
      <DataInitialize />
      <ComfirmLocalStorage />
      <div className="w-full h-screen flex flex-col justify-center items-center" style={{ backgroundColor: "#f9f8f7" }}>
        <div className="text-center">
          <h3 className="text-gray-600 text-lg mb-4 font-nico" style={{ color: "#7d7d7d" ,fontFamily: 'NicoMoji'}}>パスワード</h3>

          <JoinRoomForm />
          <div className="flex items-center gap-4 mb-4 w-64">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="text-gray-500 text-sm" style={{ fontFamily: 'NicoMoji' }}>または</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>
          <AddRoomForm />
        </div>
        
      </div>
    </div>
  );
};

export default Home;
