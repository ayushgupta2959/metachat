const Channels = ({
  provider,
  account,
  metachat,
  channels,
  currentChannel,
  setCurrentChannel,
}) => {
  const channelHandler = async (channel) => {
    const hasJoined = await metachat.hasJoined(channel.id, account);

    if (hasJoined) {
      setCurrentChannel(channel);
    } else {
      const signer = await provider.getSigner();
      const transaction = await metachat
        .connect(signer)
        .mint(channel.id, { value: channel.cost });
      await transaction.wait();
      setCurrentChannel(channel);
    }
  };

  return (
    <div className="channels">
      <div className="channels__text">
        <h2>Text Channels</h2>

        <ul>
          {channels.map((channel, index) => (
            <li
              onClick={() => channelHandler(channel)}
              key={index}
              className={
                currentChannel &&
                currentChannel.id.toString() === channel.id.toString()
                  ? "active"
                  : ""
              }
            >
              {channel.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Channels;
