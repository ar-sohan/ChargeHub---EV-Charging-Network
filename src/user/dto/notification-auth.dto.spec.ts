import { ValidationPipe } from '@nestjs/common';
import { NotificationAuthDto } from './notification-auth.dto';

describe('Pusher authorization request validation', () => {
  const pipe = new ValidationPipe({
    whitelist: true, forbidNonWhitelisted: true, transform: true,
  });
  const validate = (body: unknown) => pipe.transform(body, {
    type: 'body', metatype: NotificationAuthDto,
  });

  it.each(['private-user-1', 'private-user-12', 'private-user-123'])(
    'accepts a real socket ID and channel %s', async (channel) => {
      await expect(validate({
        socket_id: '123456.789012', channel_name: channel,
      })).resolves.toMatchObject({ channel_name: channel });
    },
  );

  it.each(['123x456', 'ddd', '', '123'])(
    'rejects malformed socket ID %s', async (socket) => {
      await expect(validate({
        socket_id: socket, channel_name: 'private-user-1',
      })).rejects.toThrow();
    },
  );

  it.each(['private-user-0', 'private-user-01', 'public-user-1', 'private-user-1d'])(
    'rejects malformed channel %s', async (channel) => {
      await expect(validate({
        socket_id: '123.456', channel_name: channel,
      })).rejects.toThrow();
    },
  );
});
