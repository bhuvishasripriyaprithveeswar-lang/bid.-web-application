const BidHistory = ({ bids }) => {
  if (!bids.length) return <p style={{ color: 'var(--muted)' }}>No bids yet.</p>;

  return (
    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>Bidder</th>
          <th>Amount</th>
          <th>Time</th>
        </tr>
      </thead>
      <tbody>
        {bids.map((bid, i) => (
          <tr key={bid._id}>
            <td>{i + 1}</td>
            <td>{bid.bidder?.name}</td>
            <td style={{ color: 'var(--primary)', fontWeight: 700 }}>${bid.amount}</td>
            <td style={{ color: 'var(--muted)', fontSize: '.82rem' }}>{new Date(bid.createdAt).toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default BidHistory;
