import JoinRoomForm from "@/components/forms/JoinRoomForm";
import AddRoomForm from "@/components/forms/AddRoomForm";

const Home = () => {

  return (
    <div>
      <section className="text-center mb-2 text-2xl font-medium">
        <h3 className="mb-4">Home</h3>
        <div className="flex flex-col items-center gap-4">
          <AddRoomForm />

          <JoinRoomForm />
        </div>
      </section>
    </div>
  );
};

export default Home;
