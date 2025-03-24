export default function MovieFavoriteIcon({ favorite }: { favorite: boolean }) {
  return (
    <>
      {favorite ? (
        <i
          className="fa-solid fa-heart font-bold"
          style={{ fontSize: 25, color: "#ff9fd2" }}
        />
      ) : (
        <i
          className="fa-regular fa-heart"
          style={{ fontSize: 25, color: "#fff" }}
        />
      )}
    </>
  );
}
