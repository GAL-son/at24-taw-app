import { posix } from "path";
import { IData, Query } from "../models/data.model";
import PostModel from '../schemas/data.schema';
import { IPost } from "modules/models/post.model";

class DataService {
    private likes: Array<IPost>;

    constructor() {
        this.likes = new Array<IPost>();
    }

    public async createPost(postParams: IData) {
        try {
            const dataModel = new PostModel(postParams);
            const postData: IPost = {
                id: dataModel.id,
                likes: 0,
                dislikes: 0
            }
            this.likes.push(postData);
            await dataModel.save();
        } catch (error) {
            console.error('Error ocurred while creating data:', error);
            throw new Error('Error ocurred while creating data');
        }
    }

    public async query(query: Query<number | string | boolean>) {
        try {
            const result = await PostModel.find(query, { __v: 0, _id: 0 });
            return this.parsePosts(result);
        } catch (error) {
            console.error('Querry failed:', error);
            throw new Error(`Query failed: ${error}`);
        }
    }

    public async getAllPosts() {
        try {
            const result = await PostModel.find({}, {__v:0});
            
            return this.parsePosts(result);
        } catch (error) {
            console.error('Error occurred while retrieving all posts:', error);
            throw new Error('Error occurred while retrieving all posts');
        }
    }

    public async deleteData(query: Query<number | string | boolean>) {
        try {
            await PostModel.deleteMany(query);
        } catch (error) {
            console.error('Error ocurred while deleting data:', error);
            throw new Error('Error ocurred while deleting data');
        }
    }

    public updateLikes(id: string, likes: number, dislikes:number) {
        const post = this.findLikes(id);

        console.log(post);
        console.log(likes);
        
        post.likes += likes;
        post.dislikes += dislikes;
        console.log(post);
    }

    private generateLikes(posts: any) {
        posts.forEach((post: any) => {
            const likePost = this.findLikes(post.id);
            console.log(likePost);
            
            if(likePost == undefined) {
                const likesNum = Math.round(Math.random() * 1000);
                const dislikesNum = Math.round(Math.random() * 1000);
                const postData: IPost = {
                    id: post.id,
                    likes: likesNum,
                    dislikes: dislikesNum
                }

                this.likes.push(postData);

            }
        });
    }


    private findLikes(id: string) {
        return this.likes.find(post => post.id == id);
    }

    private parsePosts(posts: any) {
        this.generateLikes(posts);

        console.log(this.likes);
        
        const parsed = posts.map((post: any) => {           
            const newPost = {
                ...post._doc,
                ...this.findLikes(post.id)
            }
            delete(newPost.id)
            return newPost;
        })

        console.log("PARSER--------------");
        
        console.log(parsed);
        

        return parsed;
    }
}

export default DataService;