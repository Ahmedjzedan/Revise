import MainContentElement from "@/app/_components/UI/MainContent/MainContentElement";
import MainContentGroupElement from "@/app/_components/UI/MainContent/MainContentGroupElement";
import { getPageDataEager } from "@/app/_utils/dbHelpers";

interface MainContentProps {
  pageTitle: string;
}

const MainContent = async ({ pageTitle }: MainContentProps) => {
  const pageData = await getPageDataEager(pageTitle);
  return (
    <div className="flex flex-col gap-0">
      {pageData.topLevelStandardNodes.map((node) => (
        <MainContentElement
          key={node.id}
          id={node.id.toString()}
          title={node.name}
          fillProp={node.fullness}
          maxFillProp={node.maximum}
        />
      ))}

      {pageData.topLevelGroupsWithChildren.map((groupNode) => (
        <MainContentGroupElement
          key={groupNode.id}
          id={groupNode.id.toString()}
          title={groupNode.name}
          initialChildren={groupNode.children} // Pass the eagerly loaded children
        />
      ))}
    </div>
  );
};

export default MainContent;
