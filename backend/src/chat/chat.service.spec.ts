// import { Test, TestingModule } from '@nestjs/testing';
// import { ChatService } from './chat.service';

// describe('ChatService', () => {
//   let service: ChatService;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [ChatService],
//     }).compile();

//     service = module.get<ChatService>(ChatService);
//   });

//   it('should be defined', () => {
//     expect(service).toBeDefined();
//   });
// });


// import { Test, TestingModule } from '@nestjs/testing';
// import { ChatService } from './chat.service';

// describe('ChatService', () => {
//   let chatService: ChatService;
//   let mockMessageRepository: any;

//   beforeEach(async () => {
//     mockMessageRepository = {
//       save: jest.fn(),
//       findRecent: jest.fn()
//     };

//     const module: TestingModule = await Test.createTestingModule({
//       providers: [
//         ChatService,
//         {
//           provide: 'MessageRepository', // Notice here we're providing a mock instead
//           useValue: mockMessageRepository
//         }
//       ],
//     }).compile();

//     chatService = module.get<ChatService>(ChatService);
//   });

//   it('should save a message', async () => {
//     const testMessage = { content: 'Hello', author: 'Alice' };

//     mockMessageRepository.save.mockResolvedValue(testMessage); // We're controlling the mock's behavior

//     const result = await chatService.saveMessage('Hello', 'Alice');
    
//     expect(mockMessageRepository.save).toHaveBeenCalledWith(testMessage); // Check if the mock method was called correctly
//     expect(result).toEqual(testMessage); // Check if the result is as expected
//   });

//   it('should retrieve recent messages', async () => {
//     const messages = [
//       { content: 'Hello', author: 'Alice' },
//       { content: 'Hi', author: 'Bob' },
//     ];

//     mockMessageRepository.findRecent.mockResolvedValue(messages);

//     const result = await chatService.getRecentMessages();

//     expect(mockMessageRepository.findRecent).toHaveBeenCalled(); // Check if the mock method was called
//     expect(result).toEqual(messages);
//   });
// });


import { Test, TestingModule } from '@nestjs/testing';
import { ChatService } from './chat.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Message } from './message.entity/message.entity';
import { Repository } from 'typeorm';

describe('ChatService', () => {
  let service: ChatService;
  let mockMessageRepository: Partial<Repository<Message>>;

  beforeEach(async () => {
    // Mock the repository
    mockMessageRepository = {
      find: jest.fn(),
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatService,
        { provide: getRepositoryToken(Message), useValue: mockMessageRepository },
      ],
    }).compile();

    service = module.get<ChatService>(ChatService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAllMessages', () => {
    it('should retrieve all messages', async () => {
      jest.spyOn(mockMessageRepository, 'find').mockResolvedValueOnce([]);
      expect(await service.getAllMessages()).toEqual([]);
    });
  });

});
