export default function Footer() {
    return (
      <footer className="mt-32   border-2 px-10 py-4 glassy-effect-navbar flex justify-between">
        <span className="block  text-md text-gray-500 sm:text-center dark:text-gray-400 ">
          Developed by ,
          <div className="flex flex-col">
            <span>Mandar Parekh</span>
            <span>Kris Patel</span>
            <span>Mahipal Suchar</span>
          </div>
        </span>
        <span className="block  text-sm text-gray-500 sm:text-center dark:text-gray-400 ">
          © 2024 <a className="hover:underline">KisanSathi</a>. All Rights
          Reserved.
        </span>
      </footer>
      
    );
  }
  