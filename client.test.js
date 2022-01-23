const mockList = jest.fn();
const mockListAll = jest.fn();
const mockUpdate = jest.fn();
const mockDelete = jest.fn();
const mockCreate = jest.fn();
const mockGet = jest.fn();

const driveFiles = {files:{
    list:mockList,
    update:mockUpdate,
    delete:mockDelete,
    create:mockCreate,
    get:mockGet}}

const mockDrive = jest.fn(()=> driveFiles);

const jsonData = '{"test":"1"}';
const filename = 'data.json';
const error = "test error";

jest.mock('googleapis', () =>({
    google: {
        drive: mockDrive
    }
}));

const Client = require('./client');

describe('find', ()=>{    
    it('resolved to data.files property of drive.files.list result', async() => {
        //arrange
        const foundFiles = ["test"];
        const result = {data:{files:foundFiles}};
        mockList.mockImplementation((a)=>Promise.resolve(result));
        const client = new Client({});
    
        //act, assert
        await expect(client.find("test")).resolves.toEqual(foundFiles);
    })

    it('rejects when drive.files.list rejects', async() => {
        //arrange
        mockList.mockImplementation((a)=>Promise.reject(error));
        const client = new Client({});
    
        //act, assert
        await expect(client.find("test")).rejects.toEqual(error);
    })

    it('rejects when drive.files.list throws error', async() => {
        //arrange
        mockList.mockImplementation((a)=>{ throw error; });
        const client = new Client({});
    
        //act, assert
        await expect(client.find("test")).rejects.toEqual(error);
    })
});

describe('list', ()=>{    
    it('resolves to data.files property of drive.files.list result', async() => {
        //arrange
        const foundFiles = ['test1', 'test2'];
        const result = {data:{files:foundFiles}};
        mockList.mockImplementation((a)=>Promise.resolve(result));
        const client = new Client({});

        //act, assert
        await expect(client.list()).resolves.toEqual(foundFiles);
    })

    it('rejects when drive.files.list rejects', async() => {
        //arrange
        mockList.mockImplementation((a)=>Promise.reject(error));
        const client = new Client({});
    
        //act, assert
        await expect(client.list()).rejects.toEqual(error);
    })

    it('rejects when drive.files.list throws error', async() => {
        //arrange
        mockListAll.mockImplementation((a)=>{ throw error; });
        const client = new Client({});
    
        //act, assert
        await expect(client.list()).rejects.toEqual(error);
    })
});

describe('update', ()=>{    
    const data = '"test":"1"';
    it('resolves to data property of the drive.files.update result', async() => {
        //arrange
        const result = {id:1};
        mockUpdate.mockImplementation((a)=>Promise.resolve({data:result}));
        const client = new Client({});
    
        //act, assert
        await expect(client.update(filename, data)).resolves.toEqual(result);
    })

    it('rejects when drive.files.update rejects', async() => {
        //arrange
        const result = undefined;
        const error = "test error";
        mockUpdate.mockImplementation((a)=>Promise.reject(error));
        const client = new Client({});
    
        //act, assert
        await expect(client.update(filename, data)).rejects.toEqual(error);
    })

    it('rejects when drive.files.update throws error', async() => {
        //arrange
        const result = undefined;
        const error = "test error";
        mockUpdate.mockImplementation((a)=> { throw error;});
        const client = new Client({});
    
        //act, assert
        await expect(client.update(filename, data)).rejects.toEqual(error);
    })
});

describe('delete', ()=>{ 
    const client = new Client({});
    const fileId = '1';
    mockDelete.mockImplementation((arg)=>{
        console.log('delete arg:', arg);
        if(arg.fileId === fileId) {
            return Promise.resolve();
        }
        else {
            return Promise.reject(error);
        }
    });
    
    it('resolves promise when no errors', async() => {
        //arrange, act, assert
        await expect(client.delete(fileId)).resolves.not.toThrow();
    })

    it('rejects when drive.files.delete rejects', async() => {
        //arrange
        
        //act, assert
        await expect(client.delete('2')).rejects.toEqual(error);
    })

    it('rejects when drive.files.delete throws error', async() => {
        //arrange
        mockDelete.mockImplementation((a)=>{ throw error; });
    
        //act, assert
        await expect(client.delete(fileId)).rejects.toEqual(error);
    })
});

describe('create', ()=>{        
    it('resolves to data property of drive.files.create result', async() => {
        //arrange
        const result = {id:1};
        mockCreate.mockImplementation((a)=>Promise.resolve({data:result}));
        const client = new Client({});
    
        //act, assert
        await expect(client.create(filename, jsonData)).resolves.toEqual(result);
    })

    it('rejects when drive.files.create rejects', async() => {
        //arrange
        mockCreate.mockImplementation((a)=>Promise.reject(error));
        const client = new Client({});
    
        //act, assert
        await expect(client.create(filename, jsonData)).rejects.toEqual(error);
    })

    it('rejects when drive.files.create throws error', async() => {
        //arrange
        mockCreate.mockImplementation((a)=>{ throw error; });
        const client = new Client({});
    
        //act, assert
        await expect(client.create(filename, jsonData)).rejects.toEqual(error);
    })
});

describe('get', ()=>{ 
    const client = new Client({});
    const fileId = '1';
    
    it('resolves to data property of drive.files.get result', async() => {
        //arrange
        mockGet.mockImplementation((a)=>Promise.resolve({data:jsonData}));
    
        //act, assert
        await expect(client.get(fileId)).resolves.toEqual(jsonData);
    })

    it('rejects when drive.files.get rejects', async() => {
        //arrange
        mockGet.mockImplementation((a)=>Promise.reject(error));
    
        //act, assert
        await expect(client.get(fileId)).rejects.toEqual(error);
    })

    it('rejects when drive.files.get throws error', async() => {
        //arrange
        mockGet.mockImplementation((a)=>{ throw error; });
    
        //act, assert
        await expect(client.get(fileId)).rejects.toEqual(error);
    })
});