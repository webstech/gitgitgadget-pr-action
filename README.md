# <!-- start title -->

# GitHub Action: gitgitgadget PR Action

<!-- end title -->

# <!-- start description -->

This is a GitHub action to process pull request creates, updates and comments with gitgitgadget. It is used as a workflow dispatch action running in a separate repo. The use case is for repos that will not allow complex github actions in the codebase when the github repo is a clone that is used to submit updates to a non-GitHub maintained repo.

<!-- end description -->

# <!-- start usage -->

```yaml
- uses: webstech/gitgitgadget-pr-action@v0.5.0
  with:
    # A repo scoped GitHub Personal Access Token.
    token: ""

    # An optional GitHub token to use for reactions.
    # Default: ${{ github.token }}
    reaction-token: ""

    # Add reactions to comments containing commands.
    # Default: true
    reactions: ""

    # The repository permission level required by the user to dispatch commands.
    # Default: write
    permission: ""

    # The location of the repository.
    repository-dir: ""

    # The location of the repository with gitgitgadget configuration information.
    config-repository-dir: ""

    # The file of configuration information.
    configuration-file: ""

    # JSON configuration for commands.
    config: ""

    # JSON configuration from a file for commands.
    config-from-file: ""

    # Repository owner.
    repo-owner: ""

    # Repository name.
    repo-name: ""

    # Repository pull target.
    repo-baseowner: ""

    # Pull request number.
    pull-request-number: ""

    # Comment id for handling comments.
    comment-id: ""

    # Value of 'push' or 'comment'
    action: ""

    # Comment id for handling comments.
    skip-update: ""
```

<!-- end usage -->

# <!-- start inputs -->

| **Input**                   | **Description**                                                             |      **Default**      | **Required** |
| :-------------------------- | :-------------------------------------------------------------------------- | :-------------------: | :----------: |
| **`token`**                 | A repo scoped GitHub Personal Access Token.                                 |                       |   **true**   |
| **`reaction-token`**        | An optional GitHub token to use for reactions.                              | `${{ github.token }}` |   **true**   |
| **`reactions`**             | Add reactions to comments containing commands.                              |        `true`         |   **true**   |
| **`permission`**            | The repository permission level required by the user to dispatch commands.  |        `write`        |   **true**   |
| **`repository-dir`**        | The location of the repository.                                             |                       |   **true**   |
| **`config-repository-dir`** | The location of the repository with gitgitgadget configuration information. |                       |   **true**   |
| **`configuration-file`**    | The file of configuration information.                                      |                       |   **true**   |
| **`config`**                | JSON configuration for commands.                                            |                       |   **true**   |
| **`config-from-file`**      | JSON configuration from a file for commands.                                |                       |   **true**   |
| **`repo-owner`**            | Repository owner.                                                           |                       |   **true**   |
| **`repo-name`**             | Repository name.                                                            |                       |   **true**   |
| **`repo-baseowner`**        | Repository pull target.                                                     |                       |   **true**   |
| **`pull-request-number`**   | Pull request number.                                                        |                       |   **true**   |
| **`comment-id`**            | Comment id for handling comments.                                           |                       |  **false**   |
| **`action`**                | Value of 'push' or 'comment'                                                |                       |   **true**   |
| **`skip-update`**           | Comment id for handling comments.                                           |                       |  **false**   |

<!-- end inputs -->

# <!-- start outputs -->

| **Output**      | **Description**                                   | **Default** | **Required** |
| :-------------- | :------------------------------------------------ | ----------- | ------------ |
| `error-message` | Validation errors when using `workflow` dispatch. |             |              |

<!-- end outputs -->

## License

[MIT](LICENSE)
