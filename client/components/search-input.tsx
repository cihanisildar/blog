import { Input } from "./ui/input";

interface SearchInputProps {
    onSearch: (query: string) => void;
  }
  
  const SearchInput: React.FC<SearchInputProps> = ({ onSearch }) => {
    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      const query = formData.get('search') as string;
      onSearch(query);
    };
  
    return (
      <form onSubmit={handleSearch}>
        <Input
          type="search"
          name="search"
          placeholder="Search posts..."
          className="md:w-[100px] lg:w-[300px]"
        />
      </form>
    );
  };
  
  export default SearchInput;