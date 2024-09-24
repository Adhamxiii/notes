/* eslint-disable react/prop-types */
const EmptyCard = ({ message }) => {
  return (
    <div className="flex h-[calc(100vh-7.5rem)] items-center justify-center">
      <div className="text-center">
        <img
          src="https://plus.unsplash.com/premium_vector-1682307869985-8a796d31d076?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Ymxhbmt8ZW58MHx8MHx8fDA%3D"
          alt="empty"
          className="mx-auto w-32"
        />
        <h2 className="mt-4 text-lg font-medium">No Notes Found</h2>
        <p className="text-sm text-slate-500">{message}</p>
      </div>
    </div>
  );
};

export default EmptyCard;
