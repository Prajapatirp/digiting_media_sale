interface BreadCrumbProps {
  title: string;
  pageTitle: string;
}

const BreadCrumb = ({ title, pageTitle }: BreadCrumbProps) => {
  return <h4 className="absolute">{title}</h4>;
};

export default BreadCrumb;
