import CircularProgress from '@mui/material/CircularProgress';

const Loading = (props) => {
  const { isLoading } = props;

  return (
    <>
      { isLoading ? (
        <div className="overlay">
          <CircularProgress />
        </div>
    ) : (
      <></>
    )}
    </>
  )
}
export default Loading;