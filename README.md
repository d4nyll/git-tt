# `git tt`

`git tt` (short for **t**ime **t**ravel) is a Git extension that makes it <i>super easy</i>™ for you to commit in the future or the past!

```console
$ git tt -m "Commit in the past" --date "2 weeks ago"
$ git tt -m "Commit in the future" --date "3 hours from now"
```

## Installation

`git tt` is written in [Node.js](https://nodejs.org/), and so you should have Node.js installed on your system. If you do not, I'd recommend installing [nvm](https://github.com/creationix/nvm) and then use it to install the latest version of Node.js.

```console
$ curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash
$ source ~/.bashrc
$ nvm install node
```

After Node.js is installed, install `git tt` globally it using npm.

```console
$ npm install --global @d4nyll/git-tt
```

## Usage

`git tt` works in the exact same way as `git commit`, apart from the `--date` option, which differs in the following ways:

* **Committer date** - In `git commit`, the `--date` option allows you to specify the _author date_, whilst with `git tt`, the `--date` specifies both the author date _and committer date_.
* **Natural langauge processing (NLP)** - `git tt` uses [`chrono`](https://github.com/wanasit/chrono) to parse `--date`, which means you can use date strings like `"yesterday at 20:43"` or `"30 minutes from now"`, as well as the usual [RFC 2822](https://www.ietf.org/rfc/rfc2822.txt), [ISO 8601](https://www.iso.org/iso-8601-date-and-time-format.html), [RFC 3339](https://www.ietf.org/rfc/rfc3339.txt), and other common formats
* **Aliased** - `-d` has been added as an alias to `--date`

<pre>
$ date
Thu Oct 18 <b>00:46:47</b> BST 2018
$ git tt -m "Commit in the future" --date <b>"2 hours from now"</b>
[master 66b8b8d] Commit in the future
 3 files changed, 50 insertions(+), 2 deletions(-)
 create mode 100644 README.md
$ git show --quiet --format=fuller 66b8b8d
commit 66b8b8ddb394a66f9691d3736924f1a1e17ae816 (HEAD -> master)
Author:     Daniel Li <dan@danyll.com>
<b>AuthorDate</b>: Thu Oct 18 <b>02:46:47</b> 2018 +0100
Commit:     Daniel Li <dan@danyll.com>
<b>CommitDate</b>: Thu Oct 18 <b>02:46:47</b> 2018 +0100

    Commit in the future
</pre>

### Examples

```console
$ git tt -m "Commit in the present" # Same as `git commit`
$ git tt -m "Commit in the past" --date "Thu Oct 18 2016 00:01:27 GMT+0100 (British Summer Time)"
$ git tt -m "Commit in the future" -d "2022-05-13T23:57:37.566Z"
$ git tt -m "Using relative time " -d "three weeks from now"
```

> Note on timezone - `git tt` uses your machine's local timezone (the same behavior as `git commit`). When time-travelling, `git tt` will use the timezone that would apply _at the time you're travelling to_. (Basically, you don't need to care about timezones)

## Development

To develop `git tt`, make sure you have Node.js and the [yarn](https://yarnpkg.com/en/) package manager installed. Please use yarn as the primary lock file we use is `yarn.lock`.

Next, clone the repository.

```console
$ cd ~/projects
$ git clone git@github.com:d4nyll/git-tt.git
```

Then, every line of relevant code is defined in `cli.js`.

### Testing

I did not follow [test-driven development (TDD)](https://en.wikipedia.org/wiki/Test-driven_development) because I was initially just playing around, and was unsure about the interface that `git tt` should expose. I will continue to use `git tt` in my every day workflow to make sure it's user-friendly, fix any bugs, and once I am happy, the plan is to revisit this and write the unit tests.

To test it manually, run `npm link`, which will make the `git tt` command available on your shell. Once you've finished testing, run `npm unlink` to reset it.

### Roadmap

If this tool becomes more popular, or if you'd like to contribute to new features, here are some of the features I have in mind:

* Make error output more user-friendly
* Add fuzziness to the dates - if the user specifies a `--fuzzy` flag, add a few seconds/minutes in a random fashion so the dates are not so 'precise'. E.g. instead of `Thu Oct 25 12:00:00 2018 +0100`, make it `Thu Oct 25 12:03:56 2018 +0100`
* Allow users to retrospectively modify the author and committer date of a commit
