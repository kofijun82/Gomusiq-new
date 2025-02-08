{/* Update the artist column in the playlist view */}
<div className="col-span-3">
  <Link
    to={`/artist/${song.artist_id}`}
    className="text-gray-400 hover:text-purple-500 transition"
  >
    {(song as any).artist?.artist_name}
  </Link>
</div>