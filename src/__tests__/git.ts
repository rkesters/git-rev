import { Git } from "../git";
import * as fs from "fs-extra";
import * as path from "path";
import moment from "moment";
import bluebird from "bluebird";

describe("Git", () => {
    const repoPath = "./testRepo";

    describe("repo", () => {
        afterEach(() => {
            fs.rmdirSync(repoPath, { recursive: true });
        });

        test("create repo", () => {
            const git = Git.createRepo(repoPath);

            expect(fs.existsSync(repoPath)).toBeTruthy();
            expect(fs.existsSync(path.resolve(repoPath, ".git"))).toBeTruthy();
        });
    });

    describe("git functions", () => {
        afterEach(() => {
            fs.rmdirSync(repoPath, { recursive: true });
        });

        beforeEach(async () => {
            const git = Git.createRepo(repoPath);
            fs.writeFileSync(path.resolve(repoPath, "README.md"), "LOVE");
            git.addAll();
            git.commit("initial commit");
        });

        test("branchName", () => {
            const git = new Git(repoPath);
            expect(git.branchName()).toBe("master");
        });
        test("commitHash", () => {
            const git = new Git(repoPath);

            expect(git.commitHash()).toBeDefined();
            expect(git.commitHash().length).toBe(40);
        });
        test("commitHash true", () => {
            const git = new Git(repoPath);

            expect(git.commitHash(true)).toBeDefined();
            expect(git.commitHash().length).toBe(40);
        });
        test("commitDate", () => {
            const git = new Git(repoPath),
                d = moment.utc(),
                gd = git.commitDate();
            expect(gd).toBeDefined();
            const g = moment(gd);
            expect(g.diff(d, "s")).toBeLessThanOrEqual(2);
        });
        test("commitCount", () => {
            const git = new Git(repoPath);
            expect(git.commitCount()).toBe(1);
        });
        test("message", () => {
            const git = new Git(repoPath);
            expect(git.message()).toBe("initial commit");
        });

        test("not isDirty", () => {
            const git = new Git(repoPath);
            expect(git.isDirty()).toBeFalsy();
        });

        test("isDirty", async () => {
            const git = new Git(repoPath);
            fs.writeFileSync(path.resolve(repoPath, "README.md"), "HATE");
            expect(git.isDirty()).toBeTruthy();
            git.commit("2");
            expect(git.isDirty()).toBeFalsy();
        });

        test("log", () => {
            const git = new Git(repoPath);
            const log = git.log();
            expect(log).toBeDefined();
            expect(log.length).toBe(1);
            expect(log[0].date).toBeDefined();
            expect(log[0].hash).toBeDefined();
            expect(log[0].name).toBeDefined();
            expect(log[0].subject).toBeDefined();
        });

        test("createBranch", () => {
            const git = new Git(repoPath);
            const branch = "testLocal";
            const current = git.branchName();

            git.createBranch(branch);
            git.checkoutBranch(branch);
            expect(git.branchName()).toEqual(branch);
            git.checkoutBranch(current);
            git.deleteBranch(branch);

            git.createBranch(branch);
            git.checkoutBranch(branch);
            git.checkoutBranch(current);
            git.deleteBranch(branch);
            expect(git.branchName()).toEqual(current);
        });

        /// need tags
        test("createTag", () => {
            const git = new Git(repoPath);
            const tagName = "v12000";
            git.createTag(tagName);
            expect(git.tag(false, false, "v*")).toEqual(tagName);
        });

        test("commit", () => {
            const git = new Git(repoPath);
            const tagName = "v12000";
            git.createTag(tagName);
            fs.writeFileSync(path.resolve(repoPath, "README.md"), "SEXY");
            git.addAll();
            git.commit("Shame");
            expect(git.logN1("%s")).toBe("Shame");
        });
    });

    describe("Use module repo", () => {
        test("createRemoteBranch", () => {
            const git = new Git();
            const branch = "testRemote";

            git.createRemoteBranch(branch);
            git.deleteRemoteBranch(branch);
            git.deleteBranch(branch);

            git.createRemoteBranch(branch);
            git.deleteRemoteBranch(branch);
            git.deleteBranch(branch);
        });

        test("remoteURL", () => {
            const git = new Git();
            expect(git.remoteURL()).toBeDefined();
            expect(
                git.remoteURL().startsWith("https://github.com/")
            ).toBeTruthy();
        });

        test("repositoryName", () => {
            const git = new Git();
            expect(git.repositoryName()).toBeDefined();
            expect(git.repositoryName().startsWith("git-rev")).toBeTruthy();
        });

        test("isUpdateToDate", () => {
            const git = new Git();
            expect(git.isUpdateToDate()).toBeTruthy();
        });
    });
});
