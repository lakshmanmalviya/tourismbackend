import SearchBar from "@/components/common/SearchBar"
import { SearchEntityType } from "@/types/search/searchPayload"

const Gallery = () => {
  return (
    <div>
        <SearchBar searchType={SearchEntityType.PLACE} onSearch={()=> {}}/>
        <div>
            
        </div>
    </div>
  )
}

export default Gallery
