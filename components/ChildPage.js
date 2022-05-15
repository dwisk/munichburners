import { useRouter } from "next/router";
import { revalidatePage, usePageBlocks } from "../lib/_clienthelpers";
import Blocks from "./Blocks";

export default function ChildPage (props) {
    const childPage = props.page;
    if (!childPage) {
      return null;
    }

    const { loading, page, blocks } = usePageBlocks(childPage);
    const hasCover = page.cover?.file?.url;
    const className = hasCover ? `childpage ${page.id} dsk:py-20 dsk:mt-20 relative pt-20 bx-container mb:bg-none bg-fixed bg-cover bg-center` : "py-20";
    const style = hasCover ? {backgroundImage: `url('${hasCover}')`} : {};

    const reval = (e) => {
        e.preventDefault();
        e.stopPropagation();
        refresh();
    }

    const router = useRouter();

    const refresh = async () => {
        console.info("refresh childpage cache");
        await revalidatePage(props.page.id);
        router.replace(router.asPath, router.asPath, { scroll: false }); // soft refresh
      };
    

    return <div className={className} style={style}  >
        <h1 className="page-h1 py-4 mt-20 dsk:mt-0">
            <a href={`/page/${page.id}`}>
                {loading ? childPage.child_page?.title : page?.properties?.title?.title[0].plain_text}
            </a>
        </h1>
        <section className="panel dsk:mb-0"  onDoubleClick={reval}>
            {loading ? (
                <div>...</div>
            ) : (
                <Blocks blocks={blocks} />
            ) }
            
        </section>
        <div className="childsticky dsk:hidden bx-container" style={style}  />
    </div>;
   
  };