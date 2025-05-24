import QuestPoint from './quest-point';
import User from './user';

function Header() {
  return (
    <header className="border-b border-gray-200 bg-white py-4">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="mb-2 flex items-center sm:mb-0">
            <div className="text-sm text-gray-600">
              <User />
            </div>
          </div>
          <QuestPoint />
        </div>
      </div>
    </header>
  );
}

export default Header;
