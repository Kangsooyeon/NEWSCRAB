import Tab from "../../components/common/Tab";
import { tabOptions } from "../../components/common/TabOptions";
const FilterNewsPage: React.FC = () => {
  return (
    <div>
      <h1>필터링 뉴스 페이지</h1>
      <Tab options={tabOptions} />
    </div>
  );
};

export default FilterNewsPage;