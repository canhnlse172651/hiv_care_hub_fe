

const ParseHtml = ({ htmlString }) => {
    return (
      <div dangerouslySetInnerHTML={{ __html: htmlString }} />
    );
  };
  
  
export default ParseHtml;
  